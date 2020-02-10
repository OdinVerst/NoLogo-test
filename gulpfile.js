const gulp = require('gulp');
const browserSync = require('browser-sync');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
// HTML
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
// CSS
const cssmqpacker = require('css-mqpacker');
const postcss = require('gulp-postcss');
const sortCSSmq = require('sort-css-media-queries');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const prefixer = require('gulp-autoprefixer');
// Graphic
const svgSprite = require('gulp-svg-sprite');
const svgo = require('gulp-svgo');
const rename = require('gulp-rename');
// Webpack
const webpackStream = require('webpack-stream');
const configWebpack = require('./webpack.config');
const configDevWebpack = require('./webpack.dev.config');
// Entrypoint
const configPath = require('./config.entrypoint');

const { reload } = browserSync;

gulp.task('browser-sync', () => {
	browserSync.init({
		ghostMode: {
			clicks: true,
			forms: true,
			scroll: false
		},
		server: {
			baseDir: configPath.dir
		}
	});
});

gulp.task('scripts', () => {
	return gulp
		.src(configPath.js.entry)
		.pipe(webpackStream(configDevWebpack))
		.pipe(gulp.dest(configPath.js.output));
});

gulp.task('scripts:prod', () => {
	return gulp
		.src(configPath.js.entry)
		.pipe(webpackStream(configWebpack))
		.pipe(gulp.dest(configPath.js.output));
});

gulp.task('html', () => {
	return gulp
		.src(configPath.html.entry)
		.pipe(posthtml([include({ encoding: 'utf8' })]))
		.pipe(gulp.dest(configPath.html.output))
		.pipe(reload({ stream: true }));
});

gulp.task('sass', () => {
	const plugins = [
		cssmqpacker({
			sort: sortCSSmq
		})
	];
	return gulp
		.src(configPath.css.entry)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat(configPath.css.nameFile))
		.pipe(postcss(plugins))
		.pipe(gulp.dest(configPath.css.output))
		.pipe(reload({ stream: true }));
});

gulp.task('sass:prod', () => {
	const plugins = [
		cssmqpacker({
			sort: sortCSSmq
		})
	];
	return gulp
		.src(configPath.css.entry)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat(configPath.css.nameFile))
		.pipe(
			prefixer({
				overrideBrowserslist: [
					'last 3 version',
					'> 1%',
					'ie 10',
					'maintained node versions'
				],
				cascade: false
			})
		)
		.pipe(postcss(plugins))
		.pipe(csso())
		.pipe(gulp.dest(configPath.css.outputProd));
});

gulp.task('svg', () => {
	return gulp
		.src(configPath.svg.entry)
		.pipe(svgo())
		.pipe(
			svgSprite({
				mode: {
					symbol: {
						sprite: `../${configPath.svg.nameFile}`
					}
				}
			})
		)
		.pipe(gulp.dest(configPath.svg.output));
});

gulp.task('font', () => {
	return gulp
		.src(configPath.font.entry)
		.pipe(gulp.dest(configPath.font.output));
});

gulp.task('img', () => {
	return gulp
		.src(configPath.img.entry)
		.pipe(rename({ dirname: '' }))
		.pipe(gulp.dest(configPath.img.output));
});

gulp.task('clean', () => {
	return del([configPath.dir]);
});

gulp.task('watch', () => {
	gulp.watch(configPath.html.watch, gulp.series('html'));
	gulp.watch(configPath.js.watch, gulp.series('scripts'));
	gulp.watch(configPath.css.watch, gulp.series('sass'));
	gulp.watch(configPath.svg.watch, gulp.series('svg'));
	gulp.watch(configPath.img.watch, gulp.series('img'));
	gulp.watch(configPath.font.watch, gulp.series('font'));
});

gulp.task(
	'default',
	gulp.series(
		'clean',
		gulp.parallel('scripts', 'html', 'sass', 'svg', 'img', 'font'),
		gulp.parallel('watch', 'browser-sync')
	)
);

gulp.task('prod', gulp.series(gulp.parallel('sass:prod', 'scripts:prod')));
