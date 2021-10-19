/* eslint-disable */

import { Zeus, GraphQLTypes, InputType, ValueTypes } from './index';
import { gql, useMutation, useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import type { MutationHookOptions, QueryHookOptions, LazyQueryHookOptions, SubscriptionHookOptions } from '@apollo/client';


export function useTypedMutation<Z>(
  mutation: Z | ValueTypes['mutation_root'],
  options?: MutationHookOptions<InputType<GraphQLTypes['mutation_root'], Z>>,
) {
  return useMutation<InputType<GraphQLTypes['mutation_root'], Z>>(gql(Zeus.mutation(mutation)), options);
}
export function useTypedQuery<Z>(
  query: Z | ValueTypes['query_root'],
  options?: QueryHookOptions<InputType<GraphQLTypes['query_root'], Z>>,
) {
  return useQuery<InputType<GraphQLTypes['query_root'], Z>>(gql(Zeus.query(query)), options);
}
export function useTypedLazyQuery<Z>(
  LazyQuery: Z | ValueTypes['query_root'],
  options?: LazyQueryHookOptions<InputType<GraphQLTypes['query_root'], Z>>,
) {
  return useLazyQuery<InputType<GraphQLTypes['query_root'], Z>>(gql(Zeus.query(LazyQuery)), options);
}
export function useTypedSubscription<Z>(
  subscription: Z | ValueTypes['subscription_root'],
  options?: SubscriptionHookOptions<InputType<GraphQLTypes['subscription_root'], Z>>,
) {
  return useSubscription<InputType<GraphQLTypes['subscription_root'], Z>>(gql(Zeus.subscription(subscription)), options);
}
