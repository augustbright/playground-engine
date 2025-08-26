import type { Tagged } from "type-fest";

export type EntityId = Tagged<number, "EntityId">;
export type FeatureId = Tagged<number, "FeatureId">;

export type EntityProps = object;
export type FeatureProps = object;

export type FeatureType = string;
