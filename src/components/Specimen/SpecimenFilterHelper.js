/*
Handling filter string generation in this separate  file was necessary because, apparently, having too much logic in the same file that uses the useQuery hook triggers some faulty logic in whatever lint-ish thing parses the react code, causing a conditional use of hook error (see paleobot/pbot-client#37). 

Simply moving that logic here got rid of the error. No idea, and don't have time or inclination to pursue further.
*/
export const SpecimenFilterHelper = (filters, props) => {
    let filter = '';
    if (!props.standAlone) {
        filter = ", filter: {"
        if (!filters.name && !filters.collection && !filters.preservationModes && !filters.partsPreserved && !filters.notableFeatures && !filters.identifiers && !filters.states && !filters.characters && !filters.schemas && !filters.references && !filters.description && !filters.identifiedAs && !filters.typeOf && !filters.holotypeOf && !filters.majorTaxonGroup && !filters.pbdbParentTaxon && !filters.family && !filters.genus && !filters.species && !filters.mininterval && !filters.maxinterval && !filters.lat && !filters.lon && !filters.country && !filters.state && !filters.stratigraphicGroup && !filters.stratigraphicFormation && !filters.stratigraphicMember && !filters.stratigraphicBed && !filters.enterers && !filters.intervals) {
            filter += "AND: [{elementOf_some: {pbotID_in: $groups}}, {pbotID_not_in: $excludeList}]"
        } else {
            filter += "AND: [{elementOf_some: {pbotID_in: $groups}}, {pbotID_not_in: $excludeList}";
            if (filters.name) {
                filter += ", {name_regexp: $name}"
            }
            if (filters.collection) {
                filter += ", {collection: {pbotID: $collection}}"
            }
            if (filters.preservationModes) {
                filter += ", {preservationModes: {pbotID_in: $preservationModes}}"
            }
            if (filters.partsPreserved) {
                filter += ", {partsPreserved_some: {pbotID_in: $partsPreserved}}"
            }
            if (filters.notableFeatures) {
                filter += ", {notableFeatures_some: {pbotID_in: $notableFeatures}}"
            }
            if (filters.identifiers) {
                filter += ", {identifiers: {pbotID_in: $identifiers}}"
            }
            if (filters.enterers) {
                console.log("Adding enterer")
                console.log(filters.enterers)
                filter += `, {
                    enteredBy_some: {
                        Person: {
                            pbotID_in: $enterers, 
                        }
                        type: "CREATE"
                    }
                }`
            }

            if (filters.majorTaxonGroup) {
                filter += `, {
                    identifiedAs_some: {
                        OTU: {
                            majorTaxonGroup: $majorTaxonGroup
                        }
                    }
                }`
            }

            if (filters.pbdbParentTaxon) {
                filter += `, {
                    identifiedAs_some: {
                        OTU: {
                            pbdbParentTaxon: $pbdbParentTaxon
                        }
                    }
                }`
            }

            if (filters.family) {
                filter += `, {
                    identifiedAs_some: {
                        OTU: {
                            family: $family
                        }
                    }
                }`
            }

            if (filters.genus) {
                filter += `, {
                    identifiedAs_some: {
                        OTU: {
                            genus: $genus
                        }
                    }
                }`
            }

            if (filters.species) {
                filter += `, {
                    identifiedAs_some: {
                        OTU: {
                            species: $species
                        }
                    }
                }`
            }

            if (filters.mininterval) {
                filter += `, {
                    collection: {
                        mininterval: $mininterval
                    }
                }`
            }

            if (filters.maxinterval) {
                filter += `, {
                    collection: {
                        maxinterval: $maxinterval
                    }
                }`
            }

            if (filters.country) {
                filter += `, {
                    collection: {
                        country: $country
                    }
                }`
            }

            if (filters.state) {
                filter += `, {
                    collection: {
                        state: $state
                    }
                }`
            } 


            if (filters.lat && filters.lon) {
                filter += `, {
                    collection: {
                        location_distance_lt: {
                            point: {
                                latitude: $lat
                                longitude: $lon
                            }
                            distance:10000
                        }
                    }
                }`
            }

            if (filters.stratigraphicGroup) {
                filter += `, {
                    collection: {
                        stratigraphicGroup: $stratigraphicGroup
                    }
                }`
            }
            if (filters.stratigraphicFormation) {
                filter += `, {
                    collection: {
                        stratigraphicFormation: $stratigraphicFormation
                    }
                }`
            }
            if (filters.stratigraphicMember) {
                filter += `, {
                    collection: {
                        stratigraphicMember: $stratigraphicMember
                    }
                }`
            }
            if (filters.stratigraphicBed) {
                filter += `, {
                    collection: {
                        stratigraphicBed: $stratigraphicBed
                    }
                }`
            }

            if (filters.references) {
                filter += `, {
                    references_some: {
                        Reference: {
                            pbotID_in: $references 
                        } 
                    }
                }`
            }

            if (filters.description) {
                filter += `, {
                    describedBy_some: {
                        Description: {
                            pbotID: $description 
                        } 
                    }
                }`
            }

            if (filters.identifiedAs) {
                filter += `, {
                    identifiedAs_some: {
                        OTU: {
                            pbotID: $identifiedAs 
                        } 
                    }
                }`
            }

            if (filters.typeOf) {
                filter += `, {
                    typeOf_some: {
                        OTU: {
                            pbotID: $typeOf 
                        } 
                    }
                }`
            }

            if (filters.holotypeOf) {
                filter += `, {
                    holotypeOf_some: {
                        OTU: {
                            pbotID: $holotypeOf 
                        } 
                    }
                }`
            }

            if (filters.intervals) {
                /*
                filter += `, {
                    OR: [
                        {collection: {mininterval_in: $intervals}},
                        {collection: {maxinterval_in: $intervals}}
                    ]
                }`
                */
                filter += `, {
                    collection: {
                        OR: [
                            {mininterval_in: $intervals},
                            {maxinterval_in: $intervals}
                        ]
                    }
                }`
            }

            //Note: Regarding the some/every logic below. There is no reason "every" should
            //not work for situations in which the child node pbotID array has only one entry.
            //But it doesn't. Soooo, we change to "some" in this situation. Whatever.
            if (filters.states) {
                filter += `, {
                    describedBy_some: {
                        Description: { 
                            ${filters.states.length > 1 ? "characterInstances_every" : "characterInstances_some"}: {
                                state: {
                                    State: {pbotID_in: $states}
                                }
                            }
                        }
                    }
                }`
            } 
            
            if (filters.characters) {
                filter += `, {
                    describedBy_some: {
                        Description: { 
                            ${filters.characters.length > 1 ? "characterInstances_every" : "characterInstances_some"}: {
                                character: {pbotID_in: $characters}
                            }
                        }
                    }
                }`
            } 
            
            /*
            if (filters.schemas) {
                filter += `, {
                    ${filters.schemas.length > 1 ? "describedBy_every" : "describedBy_some"}: {
                        Description: { 
                            schema: {pbotID_in: $schemas}
                        }
                    }
                }`
            }
            */
           
            //Note: This foolishness is necessary because _every does not appear to work on
            //relationships with properties. So, we need a separate clause for each schema.
            //This also means  we need separate a variable for each schema ID rather than 
            //an array of schema IDs. This is handled in SpecimenQueryResults.js. 
            //Also note: describedBy actually has no properties that we use, but it is defined 
            //with some in the schema.
            if (filters.schemas) {
                filters.schemas.forEach((s,i) => {
                    filter += `, {
                        describedBy_some: {
                            Description: { 
                                schema: {pbotID: $schema${i}}
                            }
                        }
                    }`
                })
            }
            

            filter +="]"
        }
        filter += "}"
    }
    return filter;
}
