
import {factoryAction} from "./templates";
import {appName} from "../../configs/config";

//CONSTANT
export const moduleName = 'state';
export const prefix = `${appName}/${moduleName}`;

export const CLEAR_ERROR = `${prefix}/CLEAR_ERROR`;

export const clearError = factoryAction(CLEAR_ERROR);