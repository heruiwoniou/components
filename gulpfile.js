var path = require('path'),
    gulp = require('gulp'),
    jsdoc = require('gulp-jsdoc3'),
    server = require('gulp-ss-server');

gulp.task('doc', function (cb) {
    gulp.src([
        'README.md', './src/**/*.js'
    ], {read: false}).pipe(jsdoc(require('./jsdoc.json'), cb));
});

gulp.task('default', function () {
    server.run({port: 3000})
    gulp.run('doc');
    gulp.watch([
        'README.md', './src/**/*.js'
    ], function () {
        gulp.run('doc');
    })
})