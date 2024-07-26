/*
Handling filter string generation in this separate  file was necessary because, apparently, having too much logic in the same file that uses the useQuery hook triggers some faulty logic in whatever lint-ish thing parses the react code, causing a conditional use of hook error (see paleobot/pbot-client#37). 

Simply moving that logic here got rid of the error. No idea, and don't have time or inclination to pursue further.
*/
export const OTUFilterHelper = (filters, props) => {
    let filter = '';
    if (!props.standAlone) {
        filter = ", filter: {"
        if (!filters.name && !filters.states && !filters.character && !filters.schema && !filters.partsPreserved && !filters.notableFeatures && !filters.identifiedSpecimens && !filters.typeSpecimens && !filters.holotypeSpecimen && !filters.references && !filters.synonym && !filters.mininterval && !filters.maxinterval && !filters.lat && !filters.lon && !filters.country && !filters.state && !filters.stratigraphicGroup && !filters.stratigraphicFormation && !filters.stratigraphicMember && !filters.stratigraphicBed && !filters.collection && !filters.enterers && !filters.intervals) {
            filter += "elementOf_some: {pbotID_in: $groups}"
        } else {
            filter += "AND: [{elementOf_some: {pbotID_in: $groups}}";
            //TODO: the graphql path below will change from exampleSpecimens to whatever we call
            //the set of all specimens
            if (filters.name) {
                console.log("adding name")
                filter += ", {name_regexp: $name}"
            }
            if (filters.partsPreserved) {
                console.log("adding partsPreserved")
                filter += ", {partsPreserved_some: {pbotID_in: $partsPreserved}}"
            }
            if (filters.notableFeatures) {
                filter += ", {notableFeatures_some: {pbotID_in: $notableFeatures}}"
            }
            if (filters.identifiedSpecimens) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            pbotID_in: $identifiedSpecimens 
                        } 
                    }
                }`
            }
            if (filters.typeSpecimens) {
                filter += `, {
                    typeSpecimens_some: {
                        Specimen: {
                            pbotID_in: $typeSpecimens 
                        } 
                    }
                }`
            }
            if (filters.holotypeSpecimen) {
                filter += `, {
                    holotypeSpecimen: {
                        Specimen: {
                            pbotID: $holotypeSpecimen 
                        } 
                    }
                }`
            }
            if (filters.synonym) {
                filter += `, {
                    AND: [
                        {pbotID_not: $synonym},
                        {synonyms_some: {
                            otus_some: {
                                AND: [
                                    {pbotID: $synonym}, 
                                    {pbotID_not: $pbotID}
                                ]
                            }
                        }}
                    ]
                }`
            }

            if (filters.mininterval) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                mininterval: $mininterval
                            }
                        }
                    }
                }`
            }

            if (filters.maxinterval) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                maxinterval: $maxinterval
                            }
                        }
                    }
                }`
            }

            if (filters.intervals) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                OR: [
                                    {mininterval_in: $intervals},
                                    {maxinterval_in: $intervals}
                                ]
                            }
                        }
                    }
                }`
            }

            if (filters.country) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                country: $country
                            }
                        }
                    }
                }`
            }

            if (filters.state) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                state: $state
                            }
                        }
                    }
                }`
            } 

            if (filters.lat && filters.lon) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                location_distance_lt: {
                                    point: {
                                        latitude: $lat
                                        longitude: $lon
                                    }
                                    distance:10000
                                }
                            }
                        }
                    }
                }`
            }

            if (filters.stratigraphicGroup) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                stratigraphicGroup: $stratigraphicGroup
                            }
                        }
                    }
                }`
            }
            if (filters.stratigraphicFormation) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                stratigraphicFormation: $stratigraphicFormation
                            }
                        }
                    }
                }`
            }
            if (filters.stratigraphicMember) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                stratigraphicMember: $stratigraphicMember
                            }
                        }
                    }
                }`
            }
            if (filters.stratigraphicBed) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                stratigraphicBed: $stratigraphicBed
                            }
                        }
                    }
                }`
            }

            if (filters.collection) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            collection: {
                                pbotID: $collection
                            }
                        }
                    }
                }`
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

            if (filters.references) {
                filter += `, {
                    references_some: {
                        Reference: {
                            pbotID_in: $references 
                        } 
                    }
                }`
            }
            if (filters.states) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            describedBy: {
                                Description: { 
                                    characterInstances_some: {
                                        state: {
                                            State: {pbotID_in: $states}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }`
            } else if (filters.character) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            describedBy: {
                                Description: { 
                                    characterInstances_some: {
                                        character: {pbotID: $character}
                                    }
                                }
                            }
                        }
                    }
                }`
            } else if (filters.schema) {
                filter += `, {
                    identifiedSpecimens_some: {
                        Specimen: {
                            describedBy: {
                                Description: { 
                                    schema: {pbotID: $schema}
                                }
                            }
                        }
                    }
                }`
            }
            filter +="]"
        }
        filter += "}"
    }
    return filter;
}
