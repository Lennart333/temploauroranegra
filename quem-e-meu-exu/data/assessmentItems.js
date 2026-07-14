import { questions } from "./questions.js";
import { situationalQuestions } from "./situationalQuestions.js";
import { forcedChoices } from "./forcedChoices.js";
import { priorityQuestions } from "./priorityQuestions.js";
import { repeatedPatterns } from "./repeatedPatterns.js";
import { openQuestion } from "./openQuestion.js";
export const scoredAssessmentQuestions = [...questions, ...situationalQuestions, ...forcedChoices, ...priorityQuestions, ...repeatedPatterns];
export const displayAssessmentQuestions = [...scoredAssessmentQuestions, openQuestion];
export const requiredAssessmentQuestions = scoredAssessmentQuestions;
