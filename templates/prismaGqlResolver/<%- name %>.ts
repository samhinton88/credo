/*
<%
const capName = capitalize(dashToCamel(name));
%>
*/

import { Module } from '@nestjs/common';
import {
  Context,
  Field,
  ID,
  ObjectType,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Prisma } from './prisma';
import { keyBy } from 'lodash';
<% if (loader) {%>
export type <%- capName %>sLoader = <%- capName %>Loader<string, <%- capName %>>;

export const <%- name %>sLoader = '<%- name %>sLoader';

export function create<%- capName %>sLoader(prisma: Prisma) {
  return new DataLoader<string, <%- capName %>>(async (ids) => {
    const data = await prisma.<%- dashToCamel(name)%>.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });

    const dataMap = keyBy(data, 'id');

    return ids.map((id) => {
      const value = dataMap[id];
      return {
        id: value.id,
      };
    });
  });
}
<% } %>

@ObjectType()
export class <%- capName %> {
  @Field(() => ID)
  id!: string;
  
  <% for (const field of fields) {%>
    <% 
    const [fieldName, fieldType] = field.split(':');
    %>
    @Field(<%- fieldType[0] === fieldType[0].toUpperCase() ? "() => " + fieldType : "" %>) 
    <%- fieldName %>!: <%- fieldType %>;
  <% } %>
}
<% if (resolver) {%>
@Resolver(() => <%- capName %>)
export class <%- capName %>Resolver {
  <% for (const field of fields) {%>
    <% 
    const [fieldName, fieldType] = field.split(':');
    %>
    @ResolveField()
    async <%- fieldName %>(@Parent() { id }, @Context(<%- name %>sLoader) loader: <%- capName %>sLoader) {
      const { <%- fieldName %> } = await <% if (loader) {%>loader.load(id);<% } else { %> this.prismic.<%- dashToCamel(name) %>({
        where: { id } 
      })<% } %>
      return <%- fieldName %>;
    }
  <% } %>
}
<% } %>

@Module({
  providers: [<%- capName %>Resolver],
})
export class <%- capName %>sModule {}
