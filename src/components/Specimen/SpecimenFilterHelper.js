/*
Handling filter string generation in this seperate file was necessary because, apparently, having too much logic in the same file that uses the useQuery hook triggers some faulty logic in whatever lint-ish thing parses the react code, causing a conditional use of hook error (see paleobot/pbot-client#37). 

Simply moving that logic here got rid of the error. No idea, and don't have time or inclination to pursue further.
*/
export const SpecimenFilterHelper = (filters, props) => {
    let filter = '';
    if (!props.standAlone) {
        filter = ", filter: {"
        if (!filters.name && !filters.collection && !filters.preservationModes && !filters.partsPreserved && !filters.notableFeatures && !filters.identifiers && !filters.states && !filters.character && !filters.schema && !filters.references && !filters.description && !filters.identifiedAs && !filters.typeOf && !filters.holotypeOf && !filters.majorTaxonGroup && !filters.pbdbParentTaxon && !filters.family && !filters.genus && !filters.species && !filters.mininterval && !filters.maxinterval && !filters.lat && !filters.lon && !filters.country && !filters.state) {
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

            if (filters.states) {
                filter += `, {
                    describedBy: {
                        Description: { 
                            characterInstances_some: {
                                state: {
                                    State: {pbotID_in: $states}
                                }
                            }
                        }
                    }
                }`
            } else if (filters.character) {
                filter += `, {
                    describedBy: {
                        Description: { 
                            characterInstances_some: {
                                character: {pbotID: $character}
                            }
                        }
                    }
                }`
            } else if (filters.schema) {
                filter += `, {
                    describedBy: {
                        Description: { 
                            schema: {pbotID: $schema}
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
