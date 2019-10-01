import { AsyncView } from "./view";
import { TaxonReference, Taxon } from '../../types/taxonomy';
import { UIError } from "../../types";
import { LinkedObjects } from './workspace';
import { WikipediaDescription } from './wikpedia';

export interface MainState {
    selectedTaxonRef: TaxonReference;
    selectedTaxon: Taxon;
    targetTaxon: Taxon;
}

export type MainView = AsyncView<MainState, UIError>

export interface TaxonomyStoreState {
    taxonomy: {
        main: MainState;
    };
}

// export type TaxonomyView = SyncView<ViewType.TAXONOMY, TaxonomyStoreState>;

export interface LineageView {
    taxa: Array<Taxon>;
}

export interface ChildrenView {
    taxa: Array<Taxon>;
    totalCount: number;
    page: number;
    pageSize: number;
    search: Array<string>
}

export interface TaxonomyView {
    target: {
        taxon: AsyncView<Taxon, UIError>,
        lineage: AsyncView<LineageView, UIError>,
        children: AsyncView<ChildrenView, UIError>
    },
    selected: {
        taxon: AsyncView<Taxon, UIError>,
        description: AsyncView<WikipediaDescription, UIError>;
        linkedData: AsyncView<LinkedObjects, UIError>
    }
}

