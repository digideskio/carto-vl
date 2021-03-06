import BaseExpression from '../base';
import * as schema from '../../../schema';
import PropertyExpression from '../basic/property';
import { checkInstance, checkType } from '../utils';

/**
 * Aggregate using the average. This operation disables the access to the property
 * except within other cluster aggregate functions.
 *
 * Note: `clusterAvg` can only be created by {@link carto.expressions.prop|carto.expressions.prop}, not other expressions.
 *
 * @param {Number} property - Column of the table to be aggregated
 * @return {Number} Aggregated column
 *
 * @example <caption>Use cluster average of the population as width.</caption>
 * const s = carto.expressions;
 * const viz = new carto.Viz({
 *   width: s.clusterAvg(s.prop('population'))
 * });
 *
 * @example <caption>Use cluster average of the population as width. (String)</caption>
 * const viz = new carto.Viz(`
 *   width: clusterAvg($population)
 * `);
 *
 * @memberof carto.expressions
 * @name clusterAvg
 * @function
 * @api
 */
export const ClusterAvg = genAggregationOp('clusterAvg', 'number');

/**
 * Aggregate using the maximum. This operation disables the access to the property
 * except within other cluster aggregate functions.
 *
 * Note: `clusterMax` can only be created by {@link carto.expressions.prop|carto.expressions.prop}, not other expressions.
 *
 * @param {Number} property - Column of the table to be aggregated
 * @return {Number} Aggregated column
 *
 * @example <caption>Use cluster maximum of the population as width.</caption>
 * const s = carto.expressions;
 * const viz = new carto.Viz({
 *   width: s.clusterMax(s.prop('population'))
 * });
 *
 * @example <caption>Use cluster maximum of the population as width. (String)</caption>
 * const viz = new carto.Viz(`
 *   width: clusterMax($population)
 * `);
 *
 * @memberof carto.expressions
 * @name clusterMax
 * @function
 * @api
 */
export const ClusterMax = genAggregationOp('clusterMax', 'number');

/**
 * Aggregate using the minimum. This operation disables the access to the property
 * except within other cluster aggregate functions.
 *
 * Note: `clusterMin` can only be created by {@link carto.expressions.prop|carto.expressions.prop}, not other expressions.
 *
 * @param {Number} property - Column of the table to be aggregated
 * @return {Number} Aggregated column
 *
 * @example <caption>Use cluster minimum of the population as width.</caption>
 * const s = carto.expressions;
 * const viz = new carto.Viz({
 *   width: s.clusterMin(s.prop('population'))
 * });
 *
 * @example <caption>Use cluster minimum of the population as width. (String)</caption>
 * const viz = new carto.Viz(`
 *   width: clusterMin($population)
 * `);
 *
 * @memberof carto.expressions
 * @name clusterMin
 * @function
 * @api
 */
export const ClusterMin = genAggregationOp('clusterMin', 'number');

/**
 * Aggregate using the mode. This operation disables the access to the property
 * except within other cluster aggregate functions.
 *
 * Note: `clusterMode` can only be created by {@link carto.expressions.prop|carto.expressions.prop}, not other expressions.
 *
 * @param {Category} property - Column of the table to be aggregated
 * @return {Category} Aggregated column
 *
 * @example <caption>Use cluster mode of the population in a color ramp.</caption>
 * const s = carto.expressions;
 * const viz = new carto.Viz({
 *   color: s.ramp(s.clusterMode(s.prop('category')), s.palettes.PRISM)
 * });
 *
 * @example <caption>Use cluster mode of the population in a color ramp. (String)</caption>
 * const viz = new carto.Viz(`
 *   color: ramp(clusterMode($category), PRISM)
 * `);
 *
 * @memberof carto.expressions
 * @name clusterMode
 * @function
 * @api
 */
export const ClusterMode = genAggregationOp('clusterMode', 'category');

/**
 * Aggregate using the sum. This operation disables the access to the property
 * except within other cluster aggregate functions.
 *
 * Note: `clusterSum` can only be created by {@link carto.expressions.prop|carto.expressions.prop}, not other expressions.
 *
 * @param {Number} property - Column of the table to be aggregated
 * @return {Number} Aggregated column
 *
 * @example <caption>Use cluster sum of the population as width.</caption>
 * const s = carto.expressions;
 * const viz = new carto.Viz({
 *   width: s.clusterSum(s.prop('population'))
 * });
 *
 * @example <caption>Use cluster sum of the population as width. (String)</caption>
 * const viz = new carto.Viz(`
 *   width: clusterSum($population)
 * `);
 *
 * @memberof carto.expressions
 * @name clusterSum
 * @function
 * @api
 */
export const ClusterSum = genAggregationOp('clusterSum', 'number');

function genAggregationOp(expressionName, aggType) {
    const aggName = expressionName.replace('cluster', '').toLowerCase();
    return class AggregationOperation extends BaseExpression {
        constructor(property) {
            checkInstance(expressionName, 'property', 0, PropertyExpression, property);
            super({ property });
            this._aggName = aggName;
            this.type = aggType;
        }
        get name() {
            return this.property.name;
        }
        get aggName() {
            return this._aggName;
        }
        get numCategories() {
            return this.property.numCategories;
        }
        eval(feature) {
            return feature[schema.column.aggColumn(this.property.name, aggName)];
        }
        //Override super methods, we don't want to let the property use the raw column, we must use the agg suffixed one
        _compile(metadata) {
            super._compile(metadata);
            checkType(expressionName, 'property', 0, aggType, this.property);
        }
        _applyToShaderSource(getGLSLforProperty) {
            return {
                preface: '',
                inline: `${getGLSLforProperty(schema.column.aggColumn(this.property.name, aggName))}`
            };
        }
        _postShaderCompile() { }
        _getMinimumNeededSchema() {
            return {
                columns: [
                    schema.column.aggColumn(this.property.name, aggName)
                ]
            };
        }
    };
}
