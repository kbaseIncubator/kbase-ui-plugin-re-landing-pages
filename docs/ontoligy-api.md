# initial ontology api needs

TODO: redo this doc with how the api has shaped up??

This is the result of a brainstorming session after having worked out a couple of potential interfaces for the ontology term landing page

Note that I've left out some features (complexity) provided by OBO, for the sake of simplicity for now. E.g. dbxrefs are left out. Feel free to add additional properties as needed, or remove extraneous ones. 

> All identifiers are suggestions; at a minimum, please keep the naming consistent with KBase practices and within the project. E.g. module names are usually PascalCase, function names are usually snake_case, parameters are usually snake case, return json properties are usually snake case.

> And I'm using an ontology term id like "go_ontology/GO:0006915", but I don't know if they will look like this. It doesn't matter, the front end treats them as opaque.

> Question: Should we limit relationships to certain kinds for now? E.g. is_a, part_of, has_parg, regulates.

Initially the following endpoints will be needed:

- `get_parents`: for a given term id, return list of nodes which directly reference it.
- `get_children`: for a given term id, return list of nodes which it references
- `get_term`: for a given term id, return properties of that term


Secondarily we'll need:

- `get_linked_objects`: for a given term id, return a list of objects which reference this term.
- `get_graph_above`: for a given term id, return the graph of terms above the term.
- `get_ontology_info`: for a given ontology source id and optional version, return properties of that ontology source.



## API Endpoints


### `get_parents`

For a given term id, return a list of terms closer to the root to which it is directly related. (That is, one edge away.) Each item includes id, name, relation.

Example:

#### Request 

```json
{
    "method": "RelationEngineOntologyAPI.get_parents",
    "params": {
        "id": "go_ontology/GO:0006915"
    }
}
```

#### Response 

```json
[
    {
        "id": "go_ontology/GO:0012501",
        "name": "programmed cell death",
        "relation": "is_a"
    }
]
```


### `get_children`

For a given term id, provide a list of ontology term nodes which reference the given term. Each item includes id, name, relation

Example:

#### Request params

```json
{
    "method": "RelationEngineOntologyAPI.get_children",
    "params": {
        "id": "go_ontology/GO:0006915"
    }
}
```

#### Response data

```json
[
    {
        "id": "go_ontology/GO:1902489",
        "name": "hepatoblast apoptotic process",
        "relation": "is_a"
    },
    {
        "id": "go_ontology/GO:0042981",
        "name": "regulation of apoptotic process",
        "relation": "regulates"
    },
    {
        "id": "go_ontology/GO:1904606",
        "name": "fat cell apoptotic process",
        "relation": "is_a"
    },
    {
        "id": "go_ontology/GO:1902362",
        "name": "melanocyte apoptotic process",
        "relation": "is_a"
    },
    {
        "id": "go_ontology/GO:0039526",
        "name": "modulation by virus of host apoptotic process",
        "relation": "regulates"
    },
    {
        "id": "go_ontology/GO:0006925",
        "name": "inflammatory cell apoptotic process",
        "relation": "is_a"
    },
    {
        "id": "go_ontology/GO:1904019",
        "name": "epithelial cell apoptotic process",
        "relation": "is_a"
    },
    {
        "id": "go_ontology/GO:1902108",
        "name": "regulation of mitochondrial membrane permeability involved in apoptotic process",
        "relation": "part_of"
    },
    {
        "id": "go_ontology/GO:0071887",
        "name": "leukocyte apoptotic process",
        "relation": "is_a"
    },
    {
        "id": "go_ontology/GO:1902109",
        "name": "negative regulation of mitochondrial membrane permeability involved in apoptotic process",
        "relation": "is_a"
    }
]
```

### `get_term`

for a given term, return all immediate information about a term, including id, name, namespace, definition, comment, synonyms. Note that this does not include any related terms.

> Note that the term information will depend on the ontology. Some properties will be common across all ontologies (id, name, ontology, ontology_version), while others will be specific to that ontology. We could place the ontology-specific terms into its own top-level property.

Example:

#### Request 

```json
{
    "method": "RelationEngineOntologyAPI.get_term",
    "params": {
        "id": "go_ontology/GO:0006915"
    }
}
```

#### Response 

```json
{
    "id": "go_ontology/GO:0006915",
    "name": "apoptotic process",
    "ontology": "go",
    "ontology_version": "2019-07-01",
    "namespace": "biological_process",
    "definition": "A programmed cell death process which begins when a cell receives an internal (e.g. DNA damage) or external signal (e.g. an extracellular death ligand), and proceeds through a series of biochemical events (signaling pathway phase) which trigger an execution phase. The execution phase is the last step of an apoptotic process, and is typically characterized by rounding-up of the cell, retraction of pseudopodes, reduction of cellular volume (pyknosis), chromatin condensation, nuclear fragmentation (karyorrhexis), plasma membrane blebbing and fragmentation of the cell into apoptotic bodies. When the execution phase is completed, the cell has died.",
    "comment": null,
    "synonyms": [
        {
            "text": "induction of apoptosis by p53",
            "scope": "related"
        },
        {
            "text": "apoptosis activator activity",
            "scope": "related"
        },
        {
            "text": "commitment to apoptosis",
            "scope": "related"
        },
        {
            "text": "induction of apoptosis",
            "scope": "related"
        },
        {
            "text": "apoptosis",
            "scope": "narrow"
        },
        {
            "text": "cell suicide",
            "scope": "broad"
        },
        {
            "text": "cellular suicide",
            "scope": "broad"
        },
        {
            "text": "apoptotic programmed cell death",
            "scope": "exact"
        },
        {
            "text": "activation of apoptosis",
            "scope": "narrow"
        },
        {
            "text": "caspase-dependent programmed cell death",
            "scope": "related"
        }
    ]
}
```

#### References

- http://geneontology.org/docs/GO-term-elements#synonyms


### `get_linked_objects`

For a given term id, return information about all kbase objects which reference that term. Include for each item kbase type, workspace id, object id, object version, creation time, scientific name, feature, evidence code.

Instead of scientific name, if there are non organism objects to consider, call it "name" and populate it with whatever makes sense; maybe a field which provides a type for the name (scientific_name, name, etc.)

Some of the properties are speculative:

- feature_path: it would be good to have something about the location within the object the term is associated with. It could be a path, as in the example, or expand to information about the feature itself. Having the path means we can create a url to a landing page for it (assuming it it is a Genome, which is the only type I think we support sub-object inspection).

- evidence code: I know there is discussion about attributes associated with a term when it is attached - this would be one of the possible attributes, another could be date, but that date _might_ be the same as the creation date (which is actually the "save" date since the object may have been updated, generating a version > 1).

#### Request params

```json
{
    "method": "RelationEngineOntologyAPI.get_linked_objects",
    "params": {
        "id": "go_ontology/GO:0006915"
    }
}
```

#### Response data

```json
[
    {
        "workspace_id": 43747,
        "object_id": 3,
        "version": 1,
        "object_name": "Rhodobacter_sphaeroides_2.4.1_KBase",
        "type": "KBaseGenomes.Genome-7.0",
        "label_type": "scientific_name",
        "label": "Rhodobacter sphaeroides",
        "created_at": 1566511703000,
        "feature_path": "features/25/x",
        "evidence_code": "EXP"
    }
]
```

#### References

- http://geneontology.org/docs/guide-go-evidence-codes/
- https://github.com/kbase/workspace_deluxe

### `get_graph_above`

For a given term id, return minimal node info (id, name, relation) for all terms in the graph formed by the node itself and all ancestors.

Unless we are already using a data interchange format for graphs in JSON, I'd suggest starting with something like http://jsongraphformat.info. It is simple, and can always be swapped out, and was pretty much designed for this purpose - an agnostic json graph representation for feeding directly to or being easy to transform to a form that a graph vis lib can use or to operate on to make the appropriate library calls.

This should just reflect `is_a` connections. I imagine that we'll want other connections at some point.

Example:

This is a simple example, because the graph above this node is linear.

#### Request params

```json
{
    "method": "RelationEngineOntologyAPI.get_graph_above",
    "params": {
        "id": "go_ontology/GO:0006915"
    }
}
```

#### Response data

```json
{
    "graph": {
        "type": "ontology",
        "label": "Graph above go_ontology/GO:0006915",
        "nodes": [
            {
                "id": "go_ontology/GO:0006915",
                "label": "apoptotic process"
            },
            {
                "id": "go_ontology/GO:0012501",
                "label": "programmed cell death"
            },
            {
                "id": "go_ontology/GO:0008219",
                "label": "cell death"
            },
            {
                "id": "go_ontology/GO:0009987",
                "label": "cellular process"
            },
            {
                "id": "go_ontology/GO:0008150",
                "label": "biological process"
            }
        ],
        "edges": [
            {
                "source": "go_ontology/GO:0006915",
                "target": "go_ontology/GO:0012501",
                "relation": "is_a"
            },
            {
                "source": "go_ontology/GO:0012501",
                "target": "go_ontology/GO:0008219",
                "relation": "is_a"
            },
            {
                "source": "go_ontology/GO:0008219",
                "target": "go_ontology/GO:0009987",
                "relation": "is_a"
            },
            {
                "source": "go_ontology/GO:0009987",
                "target": "go_ontology/GO:0008150",
                "relation": "is_a"
            }
        ]
    }
}
```

#### References

- http://jsongraphformat.info
- http://www.w3.org/TR/json-ld/ 

### `get ontology info`

For a given ontology source id and optional version, return info about the ontology itself. If the version is not provided, return info about the latest version of the ontology.

Include format version, data version, date, saved by, autogenerated by, default namespace, ontology.

> Note: I don't know that we have actually populated this information anywhere or decided what is important about it. Let's consider this api endpoint request the start of a conversation.

#### Request params

```json
{
    "method": "RelationEngineOntologyAPI.get_graph_above",
    "params": {
        "id": "go"
    }
}
```

#### Response data

```json
{
    "id": "go",
    "name": "Gene Ontology",
    "logo": "http://geneontology.org/assets/go-logo.large.png",
    "url": "http://geneontology.org",
    "versions": [
        "some",
        "list",
        "of",
        "versions"
    ]
}
```


obo format: http://owlcollab.github.io/oboformat/doc/obo-syntax.html


```
