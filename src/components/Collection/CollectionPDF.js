import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer';
import { alphabetize, sort } from '../../util.js';
import logo from '../../PBOT-logo-transparent.png';
import { styles } from '../../PDFStyles.js';


// Helper component for a labeled field
const LabeledField = ({ label, value }) => {
  if (!value && value !== 0) return null;
  
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
};


// Helper to render a field if it exists
const renderField = (label, value) => {
    if (!value && value !== 0) return null;
    return (
    <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>{label}:</Text>
        <Text style={styles.fieldValue}>{value}</Text>
    </View>
    );
};

// Helper to render array values
const renderArrayField = (label, arr, keyProp = null) => {
    if (!arr || arr.length === 0) return null;
    let displayValue = '';
    
    if (keyProp) {
        displayValue = arr.map(item => item[keyProp]).join(', ');
    } else {
        displayValue = arr.join(', ');
    }
    
    return renderField(label, displayValue);
};



// Helper function to aggregate OTUs similar to the web component
function aggregateOTUs(collection) {
  const identifiedAsOTUs = [];
  const typeOfOTUs = [];
  const holotypeOfOTUs = [];

  if (!collection.specimens) return { identifiedAsOTUs, typeOfOTUs, holotypeOfOTUs };

  collection.specimens.forEach(specimen => {
    // identifiedAs
    if (specimen.identifiedAs && Array.isArray(specimen.identifiedAs)) {
      specimen.identifiedAs.forEach(rel => {
        if (rel.OTU) identifiedAsOTUs.push(rel.OTU);
      });
    }
    // typeOf
    if (specimen.typeOf && Array.isArray(specimen.typeOf)) {
      specimen.typeOf.forEach(rel => {
        if (rel.OTU) typeOfOTUs.push(rel.OTU);
      });
    }
    // holotypeOf
    if (specimen.holotypeOf && Array.isArray(specimen.holotypeOf)) {
      specimen.holotypeOf.forEach(rel => {
        if (rel.OTU) holotypeOfOTUs.push(rel.OTU);
      });
    }
  });

  return { identifiedAsOTUs, typeOfOTUs, holotypeOfOTUs };
}

// Specimens component for PDF
function SpecimensPDF(props) {
  if (!props.specimens || props.specimens.length === 0) return null;
  
  const specimens = alphabetize([...props.specimens], "name");
  const level = (props.level || 0) + 1;
  const pdfStyle = {marginLeft: level * 10};
  
  return (
    <>
      {specimens.map(({pbotID, name}) => (
        <View key={pbotID} style={styles.specimenContainer}>
          <Text style={styles.singleSpacedLine}>{name}</Text>
        </View>
      ))}
    </>
  );
}

// OTUs component for PDF
function OTUsPDF(props) {
  const { identifiedAsOTUs, typeOfOTUs, holotypeOfOTUs } = aggregateOTUs(props.collection);
  
  const renderOTUs = (otus) => {
    if (!otus || otus.length === 0) {
      return <Text style={styles.paragraph}>(none)</Text>;
    }
    
    return otus.map(otu => (
      <View key={otu.pbotID} style={styles.specimenContainer}>
        <Text style={styles.singleSpacedLine}>{otu.name || otu.pbotID}</Text>
      </View>
    ));
  };
  
  return (
    <>
      <View style={styles.otuCategoryContainer}>
        <Text style={styles.subSubheading}>Identified</Text>
        {renderOTUs(identifiedAsOTUs)}
      </View>
      
      <View style={styles.otuCategoryContainer}>
        <Text style={styles.subSubheading}>Types</Text>
        {renderOTUs(typeOfOTUs)}
      </View>
      
      <View style={styles.otuCategoryContainer}>
        <Text style={styles.subSubheading}>Holotypes</Text>
        {renderOTUs(holotypeOfOTUs)}
      </View>
    </>
  );
}

// Main CollectionPDF component
export const CollectionPDF = (props) => {
    if (!props.collection) return null;

    const collection = props.collection;

    // Get workspace name (public or other)
    const isPublic = collection.elementOf && collection.elementOf.some(group => group.name === "public");
    const workspaceName = isPublic ? "public" : (collection.elementOf && collection.elementOf.length > 0 ? collection.elementOf[0].name : "private");

    // Component to be used for direct PDF viewing
    return (
        <Page size="A4" style={styles.page} wrap>

            {/* Title section */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                <Image src={logo} style={styles.logo} />
                <Text style={styles.pbotHeading}>PBot</Text>
                </View>
                <View style={styles.headerCenter}>
                <Text style={styles.heading}>Collection</Text>
                <Text style={styles.headerSubheading}>{collection.name}</Text>
                </View>
                <View style={styles.headerRight}>
                <Text style={styles.paragraph}>
                    Workspace: {workspaceName}
                </Text>
                </View>
            </View>

            {/* Key Information Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Key Information</Text>
                {renderField("PBot ID", collection.pbotID)}
                {renderField("Direct Link", collection.directURL.toString())}
                {renderField("JSON Link", collection.jsonURL.toString())}
                {renderField("PDF Link", collection.pdfURL.toString())}
                {renderField("PBDB ID", collection.pbdbid)}
            </View>

            {/* Location Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Location</Text>
                {renderField("Latitude", collection.location && collection.location.latitude)}
                {renderField("Longitude", collection.location && collection.location.longitude)}
                {renderField("GPS Coordinate Uncertainty", collection.gpsCoordinateUncertainty)}
                {renderField("Country", collection.country)}
                {renderField("State", collection.state)}
                {renderField("Protected Site", collection.protectedSite ? 'Yes' : 'No')}
                {renderField("Scale of Geographic Resolution", collection.geographicResolution)}
                {renderField("Notes on Geographic Information", collection.geographicComments)}
            </View>

            {/* Age Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Age</Text>
                {renderField("Timescale", collection.timescale)}
                {renderField("Max Interval", collection.maxinterval)}
                {renderField("Min Interval", collection.mininterval)}
                {renderField("Direct Date", collection.directDate)}
                {renderField("Direct Date Error", collection.directDateError)}
                {renderField("Direct Date Type", collection.directDateType)}
                {renderField("Numeric Maximum Age", collection.numericAgeMax)}
                {renderField("Numeric Maximum Age Error", collection.numericAgeMaxError)}
                {renderField("Numeric Maximum Age Type", collection.numericAgeMaxType)}
                {renderField("Numeric Minimum Age", collection.numericAgeMin)}
                {renderField("Numeric Minimum Age Error", collection.numericAgeMinError)}
                {renderField("Numeric Minimum Age Type", collection.numericAgeMinType)}
                {renderField("Notes on Age Information", collection.ageComments)}
            </View>

            {/* Geologic Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Geologic</Text>
                {renderField("Lithology", collection.lithology)}
                {renderField("Additional Lithology Information", collection.additionalLithology)}
                {renderField("Stratigraphic Group", collection.stratigraphicGroup)}
                {renderField("Stratigraphic Formation", collection.stratigraphicFormation)}
                {renderField("Stratigraphic Member", collection.stratigraphicMember)}
                {renderField("Stratigraphic Bed", collection.stratigraphicBed)}
                {renderField("Notes on Stratigraphy", collection.stratigraphicComments)}
                {renderField("Environment", collection.environment)}
                {renderField("Notes on Environment", collection.environmentComments)}
            </View>

            {/* Collecting Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Collecting</Text>
                {renderField("Collection Type", collection.collectionType)}
                {renderArrayField("Preservation Modes", collection.preservationModes)}
                {renderArrayField("Size Classes", collection.sizeClasses)}
                {renderField("Collection Methods", collection.collectionMethods)}
                {renderField("Collectors", collection.collectors)}
                {renderField("Notes on Collection Methods", collection.collectionComments)}
            </View>

            {/* References Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>References</Text>
                {renderField("References", sort([...collection.references], "#order").map(reference => `${reference.Reference.title}, ${reference.Reference.year}`).join('; '))}
            </View>


            {/* Specimens Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Specimens</Text>
            {collection.specimens && collection.specimens.length > 0 && (
                <SpecimensPDF specimens={collection.specimens} />
            )}
            </View>

            {/* OTUs Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>OTUs</Text>
            <OTUsPDF collection={collection} />
            </View>
        </Page>
  );
};