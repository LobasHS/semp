var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');
var rename = require('gulp-rename');

//server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });
    
    gulp.watch("build/**/*.*").on('change',browserSync.reload);
});

//pug compile
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('sourse/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest("build"))
});

//styles compile
gulp.task('styles:compile', function () {
    return gulp.src('sourse/styles/main.scss')
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});

//sprites
gulp.task('sprite', function (cb) {
    var spriteData = gulp.src('sourse/images/icom/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: 'sourse/images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('sourse/styles/global/'));
    cb();
});

//Delete
gulp.task("clean",function del(cb) {
    return rimraf('build',cb);
});

//copy fonts
gulp.task('copy:fonts',function () {
    return gulp.src('./sourse/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'))
});

//copy images
gulp.task('copy:images',function () {
    return gulp.src('./sourse/images/**/*.*')
        .pipe(gulp.dest('build/images'))
});

//copy
gulp.task('copy',gulp.parallel('copy:fonts','copy:images'));

//watchers
gulp.task('watch',function () {
    gulp.watch('sourse/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('sourse/styles/**/*.scss', gulp.series('styles:compile'));
});

//default
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile','styles:compile','sprite','copy'),
    gulp.parallel('watch','server')
    )
);