# Dispatching

This document is dedicated, for now, to brainstorming the design of the landing pate dispatch system...

## Basic Flow

1. plugin invoked with an opaque relation engine node id.

These ids should be treated as opaque, even though they have embedded identifiers which look like they can be parsed out of the id. The re node id is the same as an arango id. These ids are structured like COLLECTION/ID, where COLLECTION corresponds to an arango collection, and ID is a unique identifier (created by kbase or arango). 

2. landing page queries the relation engine to get info about the node.

A general purpose call is made with the re id which returns general information about the node. For purposes of dispatching, the interesting bit of information is the _type_ and the _source_.

The _type_ corresponds roughly to the collection. It may always be the collection. However, given experience with elastic search apis, the specific collection name may change over time. So the type corresponds to a collection. That collection may change over time, but the type won't.

The _source_ is like a subtype, but corresponds to the external source from which the relation engine data is derived. In currently considered landing pages, the collection has an external data source. This may not be the case for other types of landing pages.

3. landing page dispatches to the appropriate viewer.

The viewer is dispatched to based on the node _type_ associated with the _id_. The viewer is actually a React Component. This component is responsible for managing all data and sub components. 

For example, taxonomy nodes will be passed to the top level taxonomy viewer component, ontology to the top level ontology viewer component.

4. type-specific viewer may render source-specific components

Types may have multiple sources. Taxonomy and ontology, the two planned landing pages, do have multiple sources planned already. The _source_ information will be available in order to create specialized sub-views. This is not  part of the top level dispatch system.

There will be an effort to normalize data for different sources, to minimize to the differences between them. But differences will always remain, and need to be handled differently. This may be through different components, or even switches to selectively display content within a component.

For example, when constructing links to the page for a taxon, the urls will of course be different for different sources.

There will also simply be different information to show which is important for a user to see about a particular source. For example, an NCBI taxon may be associated with a specific NCBI accession number, which may be important for a user familiar with work on that type of organism. Other taxonomies may be less strictly tied to a specific genome. (Of course, we are talking about taxa at the organism level.)


## Component Design

index -> App -> Dispatcher

navigate to kbase-ui

based on hash structure of #review/ID invoke the re landing page top level widget with the view "main" and params "relationEngineID" set to ID.

internally the re landing page relies on the @kbase/ui-lib app base comonents and redux integration to interface with kbase-ui. kbase-ui will send a message to the plugin (via postmessage) upon intial startup and for any navigation which resolves to the same route. @kbase/ui-lib will update the redux store with the navigation data, which consists of the view name (a string) and parameters (a simple object).

back in the landing page app, App.tsx sets up a listener on the store. For all store updates it inspects the navigation info (view, params). If there is any change, it dispatches to its own internal navigation. Now, at this point the view is not expected to change (this would introduce another layer of dispatch), but the route params will. The route params are presently just the relation engine id.

The redux navigation action determines the type of the re node, and the reducer updates the store with this. The type of node is an enum. This clearly requires updating the code when there are new re types.

We'll need to document how to integrate new re types.

A Dispatcher component connects to the redux store and extracts the navigation info. The component itself contains a render method which switches on the re type. It simply renders a top level component for the re type.






## misc notes


Well, that is something of a lie. The basic structure of the landing page is hierarchical:

- generic comonent
  - landing page layout
  - perhaps some generic information common to all nodes:
    - e.g. date created, type description
  - dispatch mechanism
  - type-specific component
    - layout
    - information common to all nodes of this type
    - source-specific components:
      - layout
      - information common to nodes of this type from this source

At each level, generic information is displayed alongside more specific information, which has been made available through some sort of dispatch. You can thing of this as a switch. It may not be binary, with one generic area followed by a specific one. Rather they may be intermingled to some degree.

1. 

