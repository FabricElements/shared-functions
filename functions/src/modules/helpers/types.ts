/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */

/**
 * Filter conditions in a `Query.where()` clause are specified using the
 * strings '<', '<=', '==', '>=', and '>'.
 */
export type WhereFilterOp = "<" | "<=" | "==" | ">=" | ">";

/**
 * The direction of a `Query.orderBy()` clause is specified as 'desc' or 'asc'
 * (descending or ascending).
 */
export type OrderByDirection = "desc" | "asc";
