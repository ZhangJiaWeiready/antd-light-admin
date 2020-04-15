/**
 * 过滤打包过程中的warning输出
 * 
 * options: {
 *   exclude: string
 * }
 * 
 */

class FilterWarningPlugin {

    constructor(options) {
        if (!options || !options.exclude) {
            throw '[filter-warning-plugin] error. exclude needed';
        }
        this.exclude = options.exclude;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap('filter-warning-plugin', complation => {
            try {
                complation.warnings = complation.warnings.filter(warning => {
                    return warning.message && warning.message.indexOf(this.exclude) === -1;
                });
            } catch (err) {
                console.log(err);
            }
        });
    }
}

module.exports = FilterWarningPlugin;