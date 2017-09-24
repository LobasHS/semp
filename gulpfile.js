var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

//server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "buildProject"
        }
    });
    
    gulp.watch("buildProject/**/*.*").on('change',browserSync.reload);
});

//pug compile
gulp.task('templates:compile', function buildProjectHTML() {
    return gulp.src('src/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest("buildProject"))
});

//styles compile
gulp.task('styles:compile', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('buildProject/css'));
});

gulp.task('js:compile',function () {
    return gulp.src([
            'src/js/form.js',
            'src/js/main.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('buildProject/js'));
});

//sprites
gulp.task('sprite', function (cb) {
    var spriteData = gulp.src('src/images/icon/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('buildProject/images/'));
    spriteData.css.pipe(gulp.dest('src/styles/global/'));
    cb();
});

//Delete
gulp.task("clean",function del(cb) {
    return rimraf('buildProject',cb);
});

//copy fonts
gulp.task('copy:fonts',function () {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('buildProject/fonts'))
});

//copy images
gulp.task('copy:images',function () {
    return gulp.src('./src/images/**/*.*')
        .pipe(gulp.dest('buildProject/images'))
});

//copy
gulp.task('copy',gulp.parallel('copy:fonts','copy:images'));

//watchers
gulp.task('watch',function () {
    gulp.watch('src/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('src/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('src/js/**/*.js',gulp.series('js:compile'));
});

//default
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile','styles:compile','js:compile','sprite','copy'),
    gulp.parallel('watch','server')
    )
);