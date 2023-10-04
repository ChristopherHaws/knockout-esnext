const {terser} = require('rollup-plugin-terser');
const pkg = require('./package.json');

import createRollupInlineMacrosPlugin from './rollup-plugin-inline-macros';

const getVersion = () => `${pkg.version}`;

const getFullReleaseName = (versionSuffix) => `Knockout JavaScript library v${getVersion(versionSuffix)}`;

const getBanner = (versionSuffix = '') => `/*!
 * ${getFullReleaseName(versionSuffix)}
 * ESNext Edition - https://github.com/justlep/knockout-esnext
 * (c) The Knockout.js team - ${pkg.homepage}
 * License: ${pkg.licenses[0].type} (${pkg.licenses[0].url})
 */
`;
const getIntro = (debugEnabled) =>
    `const DEBUG = ${!!debugEnabled}; // inserted by rollup intro\n`+
    `const version = '${getVersion()}'; // inserted by rollup intro`;

const showPublishNote = () => console.log(`
To publish, run:
    git add -f ./dist/knockout.js
    git add -f ./dist/knockout.esm.mjs
    git add -f ./dist/knockout.esm.debug.mjs
    git add -f ./dist/knockout.esm.debug.mjs.map
    git checkout head
    git commit -m 'Version ${pkg.version} for distribution'
    git tag -a v${pkg.version} -m 'Add tag v${pkg.version}'
    git checkout master
    git push origin --tags
`);

export default {
    input: 'src/ko.js',
    treeshake: true,
    output: [
        {   // the minified version
            format: 'umd',
            name: 'ko',
            file: 'build/knockout.js',
            banner: getBanner(),
            intro: getIntro(),
            sourcemap: false,
            strict: false,
            plugins: [terser()]
        },
        {   // the non-minified debug version incl. sourcemap (DEBUG=true)
            format: 'umd',
            name: 'ko',
            file: 'build/knockout.debug.js',
            banner: getBanner(),
            intro: getIntro(true),
            sourcemap: true,
            strict: false
        },
        {   // the minified ES Module version
            format: 'esm',
            file: 'build/knockout-latest.esm.mjs',
            banner: getBanner(),
            intro: getIntro(),
            sourcemap: false,
            strict: false,
            plugins: [terser()]
        },
        {   // the non-minified ES Module debug version
            format: 'esm',
            file: 'build/knockout-latest.esm.debug.mjs',
            banner: getBanner(),
            intro: getIntro(),
            sourcemap: true,
            strict: false
        }
    ],
    plugins: [
        createRollupInlineMacrosPlugin({
            include: /\.js$/,
            versionName: getFullReleaseName(),
            logFile: '/build/inline-macros-plugin.log',
            verbose: false // TODO re-enable for CI environments
        })
    ]
};
