import type { Tagged } from "type-fest";

export type EntityId = Tagged<number, "EntityId">;
export type FeatureId = Tagged<number, "FeatureId">;
export type Tag = Tagged<string, "Tag">;
export type Tags = Tag[];

export type FeatureProps = object;
export type FeatureState = object;
