import * as THREE from "three";
import type { Tagged } from "type-fest";

export type EntityId = Tagged<number, "EntityId">;
export type FeatureId = Tagged<number, "FeatureId">;
export type Tag = Tagged<string, "Tag">;
export type Tags = Tag[];

export type EntityProps = object & {
    name?: string;
    tags?: Tags;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
};
export type EntityState = object;
export type FeatureProps = object;
export type FeatureState = object;
