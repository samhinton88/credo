package handlers

import (
	"log"
	"net/http"
	"regexp"
	"strconv"
)

//<%- dashToCamel(capitalize(name))%> structure that holds a logger
type <%- dashToCamel(capitalize(name))%> struct {
	l *log.Logger
}

// New<%- dashToCamel(capitalize(name))%> function return the pointer to <%- dashToCamel(capitalize(name))%> structure
func New<%- dashToCamel(capitalize(name))%>(l *log.Logger) *<%- dashToCamel(capitalize(name))%> {
	return &<%- dashToCamel(capitalize(name))%>{l}
}

func (p *<%- dashToCamel(capitalize(name))%>) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		p.get<%- dashToCamel(capitalize(name))%>(rw, r)
		return
	}
	if r.Method == http.MethodPost {
		p.addProduct(rw, r)
		return
	}
	if r.Method == http.MethodPut {
		// expect the id in the URI
		regex := regexp.MustCompile(`/([0-9]+)`)
		group := regex.FindAllStringSubmatch(r.URL.Path, -1)

		if len(group) != 1 || len(group[0]) != 2 {
			http.Error(rw, "Invalid URI", http.StatusBadRequest)
			return
		}

		idString := group[0][1]
		// Ignore the error for now
		id, _ := strconv.Atoi(idString)

		p.update<%- dashToCamel(capitalize(name))%>(id, rw, r)
	}
	// catch all other http verb with 405
	rw.WriteHeader(http.StatusMethodNotAllowed)
}

func (p *<%- dashToCamel(capitalize(name))%>) get<%- dashToCamel(capitalize(name))%>(rw http.ResponseWriter, r *http.Request) {
	p.l.Println("Handle GET products")

	listOf<%- dashToCamel(capitalize(name))%> := data.Get<%- dashToCamel(capitalize(name))%>()
	// Use encoder as it is marginally faster than json.marshal. It's important when we use multiple threads
	// d, err := json.Marshal(listOf<%- dashToCamel(capitalize(name))%>)
	err := listOf<%- dashToCamel(capitalize(name))%>.ToJSON(rw)
	if err != nil {
		http.Error(rw, "Unable to marshal json", http.StatusInternalServerError)
	}
}

func (p *<%- dashToCamel(capitalize(name))%>) addProduct(rw http.ResponseWriter, r *http.Request) {
	p.l.Println("Handle POST product")

	prod := &data.Product{}
	// The reason why we use a buffer reader is so that we don't have to allocate all the memory instantly to a slice or something like that,
	err := prod.FromJSON(r.Body)
	if err != nil {
		http.Error(rw, "Unable to unmarshal json", http.StatusBadRequest)
	}
	// p.l.Printf("Prod %#v", prod)
	data.AddProduct(prod)
}

func (p *<%- dashToCamel(capitalize(name))%>) update<%- dashToCamel(capitalize(name))%>(id int, rw http.ResponseWriter, r *http.Request) {
	p.l.Println("Handle Put product")

	prod := &data.Product{}
	// The reason why we use a buffer reader is so that we don't have to allocate all the memory instantly to a slice or something like that,
	err := prod.FromJSON(r.Body)
	if err != nil {
		http.Error(rw, "Unable to unmarshal json", http.StatusBadRequest)
	}

	err = data.UpdateProduct(id, prod)
	if err == data.ErrProductNotFound {
		http.Error(rw, "Product not found", http.StatusNotFound)
		return
	}

	if err != nil {
		http.Error(rw, "Product not found", http.StatusInternalServerError)
		return
	}

}
