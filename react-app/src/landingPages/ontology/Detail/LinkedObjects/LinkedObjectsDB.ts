import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../../../../lib/DB';
import { OntologyReference } from '../../../../types/ontology';
import { AppConfig } from '@kbase/ui-components';
import OntologyModel, { RelatedFeature } from '../../lib/model';

export type LinkedObjectsDBStateNone = DBStateNone;
export type LinkedObjectsDBStateLoading = DBStateLoading;
export type LinkedObjectsDBStateError = DBStateError;

export interface LinkedObjectsDBStateLoaded extends DBStateLoaded {
    linkedObjects: Array<RelatedFeature>
}

export type LinkedObjectsDBState = LinkedObjectsDBStateNone | LinkedObjectsDBStateLoading | LinkedObjectsDBStateError | LinkedObjectsDBStateLoaded;

export interface LinkedObjectsProps extends DBProps<LinkedObjectsDBState> {
    token: string;
    config: AppConfig;
}

export default class LinkedObjectsDB extends DB<LinkedObjectsDBState> {
    props: LinkedObjectsProps;
    constructor(props: LinkedObjectsProps) {
        super(props);
        this.props = props;

    }
    async getLinkedObjects(termRef: OntologyReference) {
        const client = new OntologyModel({
            url: this.props.config.services.ServiceWizard.url,
            token: this.props.token
        });
        try {
            this.set((state: LinkedObjectsDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADING
                }
            });

            const linkedObjects = await client.getRelatedFeatures({
                ref: termRef,
                // TODO: provided by table ui
                offset: 0,
                limit: 1000
            })

            // do the call here when it is available

            // const linkedObjects: Array<LinkedObject> = [
            //     {
            //         object: {
            //             workspaceID: 43747,
            //             id: 4,
            //             version: 1
            //         },
            //         type: {
            //             module: 'KBaseGenomes',
            //             name: 'Genome'
            //         },
            //         scientificName: 'Escherichia coli',
            //         feature: 'CF61_RS00005a'
            //     },
            //     {
            //         object: {
            //             workspaceID: 43747,
            //             id: 4,
            //             version: 1
            //         },
            //         type: {
            //             module: 'KBaseGenomes',
            //             name: 'Genome'
            //         },
            //         scientificName: 'Escherichia coli',
            //         feature: 'CF61_RS00005b'
            //     },
            //     {
            //         object: {
            //             workspaceID: 43747,
            //             id: 4,
            //             version: 1
            //         },
            //         type: {
            //             module: 'KBaseGenomes',
            //             name: 'Genome'
            //         },
            //         scientificName: 'Escherichia coli',
            //         feature: 'CF61_RS00005c'
            //     },
            //     {
            //         object: {
            //             workspaceID: 43747,
            //             id: 4,
            //             version: 1
            //         },
            //         type: {
            //             module: 'KBaseGenomes',
            //             name: 'Genome'
            //         },
            //         scientificName: 'Escherichia coli',
            //         feature: 'CF61_RS00005d'
            //     }
            // ]

            this.set((state: LinkedObjectsDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    linkedObjects: linkedObjects.features
                }
            });
        } catch (ex) {
            this.set((state: LinkedObjectsDBState) => {
                return {
                    status: DBStatus.ERROR,
                    error: {
                        code: 'not-found',
                        source: 'LinkedObjectsDB.getLinkedObjects',
                        message: ex.message
                    }
                }
            });
        }
    }

}
