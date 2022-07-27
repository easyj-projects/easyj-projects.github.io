var gulp = require('gulp'),
	minifyCss = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint');

// 默认命令,在cmd中输入gulp后,执行的就是这个任务(压缩js需要在检查js之后操作)
gulp.task('default', function () {
	// 压缩CSS
	gulp.src('./src/css/*.css') //需要操作的文件
		.pipe(rename({suffix: '.min'})) //rename压缩后的文件名
		.pipe(minifyCss()) //执行压缩
		.pipe(gulp.dest('css')); //输出文件夹

	// 压缩JS
	return gulp.src('./src/js/**/*.js') //需要操作的文件
		.pipe(rename({suffix: '.min'})) //rename压缩后的文件名
		.pipe(uglify()) //执行压缩
		.pipe(gulp.dest('js')); //输出文件夹
});
