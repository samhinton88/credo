import { reducer, <%- capitalize(dashToCamel(name)) %>State } from './<%- name %>-component';

describe('reducer', () => {
            <% state.map(item => item.split(':')).forEach(([k, v]) => { %>
              it('should change state', () => {
        
                const newState = reducer([], { type: "SET_<%- k.split('-').join('_').toUpperCase()  %>", payload: null });

                expect(newState.<%-  dashToCamel(k) %>).toEqual(null)
              });
            <% }) %>
        }
      }
})