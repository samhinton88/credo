

<% if (props) {%>
export interface <%- capitalize(dashToCamel(name)) %>Props {
<% props.forEach(p => {%>
    <%- p %>
<% }) %>
}
<%}%>

export const <%- capitalize(dashToCamel(name)) %> = () => <div />