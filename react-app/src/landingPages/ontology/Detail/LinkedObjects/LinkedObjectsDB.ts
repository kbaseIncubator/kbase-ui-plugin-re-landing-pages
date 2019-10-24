import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../../../../lib/DB';
import { LinkedObject, OntologyReference } from '../../../../types/ontology';
import { AppConfig } from '@kbase/ui-components';

export type LinkedObjectsDBStateNone = DBStateNone;
export type LinkedObjectsDBStateLoading = DBStateLoading;
export type LinkedObjectsDBStateError = DBStateError;

export interface LinkedObjectsDBStateLoaded extends DBStateLoaded {
    linkedObjects: Array<LinkedObject>
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
        try {
            this.set((state: LinkedObjectsDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADING
                }
            });

            // do the call here when it is available

            const linkedObjects: Array<LinkedObject> = [
                {
                    object: {
                        workspaceID: 43747,
                        id: 4,
                        version: 1
                    },
                    type: {
                        module: 'KBaseGenomes',
                        name: 'Genome'
                    },
                    scientificName: 'Escherichia coli',
                    feature: 'CF61_RS00005a'
                },
                {
                    object: {
                        workspaceID: 43747,
                        id: 4,
                        version: 1
                    },
                    type: {
                        module: 'KBaseGenomes',
                        name: 'Genome'
                    },
                    scientificName: 'Escherichia coli',
                    feature: 'CF61_RS00005b'
                },
                {
                    object: {
                        workspaceID: 43747,
                        id: 4,
                        version: 1
                    },
                    type: {
                        module: 'KBaseGenomes',
                        name: 'Genome'
                    },
                    scientificName: 'Escherichia coli',
                    feature: 'CF61_RS00005c'
                },
                {
                    object: {
                        workspaceID: 43747,
                        id: 4,
                        version: 1
                    },
                    type: {
                        module: 'KBaseGenomes',
                        name: 'Genome'
                    },
                    scientificName: 'Escherichia coli',
                    feature: 'CF61_RS00005d'
                }
            ]

            this.set((state: LinkedObjectsDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    linkedObjects
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
