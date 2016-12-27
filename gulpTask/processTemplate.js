const gulp = require('gulp');
const utility = require('./utility.js');

gulp.task('processTemplate', function() {
    utility.log('process backend templates');
    let source = './src/backend/view/**/*.html';
    let destDir = './build/view';
    return gulp.src(source).pipe(gulp.dest(destDir));
});
