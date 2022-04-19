package data

import (
	"encoding/json"
	"fmt"
	"io"
	"time"
)

//<%- capitalize(dashToCamel(name)) %> defines the structure for an API product
//Since encoding/json is a package residing outside our package we need to uppercase the first character of the fields inside the structure
//To get nice json field names we can add struct tags though. This will output the key name as the tag name
type <%- capitalize(dashToCamel(name)) %> struct {
	ID          int     `json:"id"`
	CreatedOn   string  `json:"-"`
	UpdatedOn   string  `json:"-"`
	DeletedOn   string  `json:"-"`
	<% props.map(p => p.split(':')).forEach(([k,v]) => { %>
		<%- capitalize(dashToCamel(k)) %>	<%- v %>  `json:"<%- dashToCamel(k) %>"`
	<% }) %>
}

// <%- capitalize(dashToCamel(name)) %>s is a type defining slice of struct <%- capitalize(dashToCamel(name)) %>
type <%- capitalize(dashToCamel(name)) %>s []*<%- capitalize(dashToCamel(name)) %>

// ToJSON is a Method on type <%- capitalize(dashToCamel(name)) %>s (slice of <%- capitalize(dashToCamel(name)) %>), used to covert structure to JSON
func (p *<%- capitalize(dashToCamel(name)) %>s) ToJSON(w io.Writer) error {
	// NewEncoder requires an io.Reader. http.ResponseWriter is the same thing
	encoder := json.NewEncoder(w)
	return encoder.Encode(p)
}

// FromJSON is a Method on type <%- capitalize(dashToCamel(name)) %>s (slice of <%- capitalize(dashToCamel(name)) %>)
func (p *<%- capitalize(dashToCamel(name)) %>) FromJSON(r io.Reader) error {
	decoder := json.NewDecoder(r)
	return decoder.Decode(p)
}

//Get<%- capitalize(dashToCamel(name)) %>s - Return the product list
func Get<%- capitalize(dashToCamel(name)) %>s() <%- capitalize(dashToCamel(name)) %>s {
	return productList
}

//Add<%- capitalize(dashToCamel(name)) %> - Add the product to our struct <%- capitalize(dashToCamel(name)) %>
func Add<%- capitalize(dashToCamel(name)) %>(p *<%- capitalize(dashToCamel(name)) %>) {
	p.ID = getNextID()
	productList = append(productList, p)
}

//Update<%- capitalize(dashToCamel(name)) %> - Updates the product to our struct <%- capitalize(dashToCamel(name)) %>
func Update<%- capitalize(dashToCamel(name)) %>(id int, p *<%- capitalize(dashToCamel(name)) %>) error {
	_, pos, err := find<%- capitalize(dashToCamel(name)) %>(id)
	if err != nil {
		return err
	}

	p.ID = id
	productList[pos] = p

	return nil
}

func find<%- capitalize(dashToCamel(name)) %>(id int) (*<%- capitalize(dashToCamel(name)) %>, int, error) {
	for i, p := range productList {
		if p.ID == id {
			return p, i, nil
		}
	}
	return nil, -1, Err<%- capitalize(dashToCamel(name)) %>NotFound
}

// Err<%- capitalize(dashToCamel(name)) %>NotFound is the Standard <%- capitalize(dashToCamel(name)) %> not found error structure
var Err<%- capitalize(dashToCamel(name)) %>NotFound = fmt.Errorf("<%- capitalize(dashToCamel(name)) %> not found")

// Increments the <%- capitalize(dashToCamel(name)) %> ID by one
func getNextID() int {
	last<%- capitalize(dashToCamel(name)) %> := productList[len(productList)-1]
	return last<%- capitalize(dashToCamel(name)) %>.ID + 1
}

var productList = []*<%- capitalize(dashToCamel(name)) %>{
	&<%- capitalize(dashToCamel(name)) %>{
		ID:          1,
		Description: "Latte",
		Name:        "Milky coffee",
		SKU:         "abc323",
		Price:       200,
		UpdatedOn:   time.Now().UTC().String(),
		CreatedOn:   time.Now().UTC().String(),
	},
	&<%- capitalize(dashToCamel(name)) %>{
		ID:          2,
		Description: "Expresso",
		Name:        "Strong coffee",
		SKU:         "errfer",
		Price:       150,
		UpdatedOn:   time.Now().UTC().String(),
		CreatedOn:   time.Now().UTC().String(),
	},
}