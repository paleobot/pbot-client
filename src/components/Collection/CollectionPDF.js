import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer';
import { alphabetize, sort } from '../../util.js';
import logo from '../../PBOT-logo-transparent.png';

/*
// Create styles for PDF layout
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: 2,
    borderColor: '#000000',
  },
  headerLeft: {
    flexDirection: 'row',
    width: '33%',
  },
  headerCenter: {
    width: '33%',
    textAlign: 'center',
  },
  headerRight: {
    width: '33%',
    textAlign: 'right',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#EEEEEE',
    padding: 8,
    borderRadius: 3,
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    border: 1,
    borderColor: '#CCCCCC',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: '30%',
  },
  fieldValue: {
    fontSize: 10,
    width: '70%',
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  link: {
    fontSize: 10,
    color: '#0000EE',
    textDecoration: 'underline',
  },
  subheading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  specimenContainer: {
    marginLeft: 10,
    marginBottom: 5,
  },
  otuContainer: {
    marginLeft: 10,
    marginBottom: 10,
  },
  otuCategoryContainer: {
    marginBottom: 10,
  }
});
*/

// Create styles for PDF layout
const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottom: 2,
        borderColor: '#000000',
    },
    headerLeft: {
        flexDirection: 'row',
        width: '33%',
    },
    headerCenter: {
        width: '33%',
        textAlign: 'center',
    },
    headerRight: {
        width: '33%',
        textAlign: 'right',
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },

    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
    },
    titleContainer: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottom: '2px solid #000000',
    },
    sectionContainer: {
        marginTop: 15,
        marginBottom: 15,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        border: '1px solid #CCCCCC',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    titleSubheading: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'right',
    },
    subheading: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottom: '1px solid #CCCCCC',
        paddingBottom: 3,
    },
    fieldRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    fieldLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        width: '20%',
    },
    fieldValue: {
        fontSize: 10,
        width: '80%',
    },
    paragraph: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 8,
    },
    singleSpacedLine: {
        fontSize: 10,
        lineHeight: 1,
        paddingLeft: 10,
    },
    spacer: {
        height: 15,
    },
    infoBox: {
        border: '1px solid #DDDDDD',
        padding: 8,
        marginBottom: 10,
        backgroundColor: '#F9F9F9',
    },
    image: {
        //marginBottom: 5,
        maxWidth: '50%',
        height: 'auto',
    },
    imageCaption: {
        fontSize: 8,
        fontStyle: 'italic',
        textAlign: 'left',
        marginBottom: 10,
    },
    table: {
        display: 'table',
        width: 'auto',
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeaderCell: {
        backgroundColor: '#EEEEEE',
        fontSize: 10,
        fontWeight: 'bold',
        padding: 4,
        borderBottom: '1px solid #CCCCCC',
    },
    tableCell: {
        fontSize: 9,
        padding: 4,
        borderBottom: '1px solid #EEEEEE',
    },
    synonymRow: {
        marginBottom: 5,
    },
    pageNumberBottom: {
        position: 'absolute',
        fontSize: 10,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumberTop: {
        position: 'relative',
        fontSize: 10,
        float: 'right',
        left: 0,
        right: 0,
        textAlign: 'right',
        color: 'grey',
    },

});



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
          <Text style={styles.paragraph}>{name}</Text>
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
        <Text style={styles.paragraph}>{otu.name || otu.pbotID}</Text>
      </View>
    ));
  };
  
  return (
    <>
      <View style={styles.otuCategoryContainer}>
        <Text style={styles.subheading}>Identified</Text>
        {renderOTUs(identifiedAsOTUs)}
      </View>
      
      <View style={styles.otuCategoryContainer}>
        <Text style={styles.subheading}>Types</Text>
        {renderOTUs(typeOfOTUs)}
      </View>
      
      <View style={styles.otuCategoryContainer}>
        <Text style={styles.subheading}>Holotypes</Text>
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

            {/* TODO: Look into hybridizing this with current header
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                <Image src={logo} style={styles.logo} />
                <Text style={styles.heading}>PBot</Text>
                </View>
                <View style={styles.headerCenter}>
                <Text style={styles.heading}>Collection</Text>
                </View>
                <View style={styles.headerRight}>
                <Text style={styles.paragraph}>
                    Workspace: {collection.elementOf && collection.elementOf[0] ? collection.elementOf[0].name : "Unknown"}
                </Text>
                </View>
            </View>
            */}

            {/* Title section */}
            <View style={styles.titleContainer}>
            <Text style={styles.heading}>{collection.name}</Text>
            <Text style={styles.titleSubheading}>Workspace: {workspaceName}</Text>
            </View>
          

            {/* Key Information Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Key Information</Text>
            <View style={styles.sectionContainer}>
                {renderField("PBot ID", collection.pbotID)}
                {renderField("Direct Link", collection.directURL.toString())}
                {renderField("JSON Link", collection.jsonURL.toString())}
                {renderField("PDF Link", collection.pdfURL.toString())}
                {renderField("PBDB ID", collection.pbdbid)}
            </View>
            </View>

            {/* Location Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Location</Text>
            <View style={styles.sectionContainer}>
                {renderField("Latitude", collection.location && collection.location.latitude)}
                {renderField("Longitude", collection.location && collection.location.longitude)}
                {renderField("GPS Coordinate Uncertainty", collection.gpsCoordinateUncertainty)}
                {renderField("Country", collection.country)}
                {renderField("State", collection.state)}
                {renderField("Protected Site", collection.protectedSite ? 'Yes' : 'No')}
                {renderField("Scale of Geographic Resolution", collection.geographicResolution)}
                {renderField("Notes on Geographic Information", collection.geographicComments)}
            </View>
            </View>

            {/* Age Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Age</Text>
            <View style={styles.sectionContainer}>
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
            </View>

            {/* Geologic Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Geologic</Text>
            <View style={styles.sectionContainer}>
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
            </View>

            {/* Collecting Section */}
            <View style={styles.sectionContainer}>
            <Text style={styles.subheading}>Collecting</Text>
            <View style={styles.sectionContainer}>
                {renderField("Collection Type", collection.collectionType)}
                {renderArrayField("Preservation Modes", collection.preservationModes)}
                {renderArrayField("Size Classes", collection.sizeClasses)}
                {renderField("Collection Methods", collection.collectionMethods)}
                {renderField("Collectors", collection.collectors)}
                {renderField("Notes on Collection Methods", collection.collectionComments)}
            </View>
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
                    <>
                    <Text style={styles.sectionHeading}>Specimens</Text>
                    <View style={styles.sectionContainer}>
                        <SpecimensPDF specimens={collection.specimens} />
                    </View>
                    </>
                )}

          {/* OTUs Section */}
          <Text style={styles.sectionHeading}>OTUs</Text>
          <View style={styles.sectionContainer}>
            <OTUsPDF collection={collection} />
          </View>
        </Page>
  );
};