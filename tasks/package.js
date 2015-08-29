// Create config.package 
var gulp = require('gulp');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var zip = require('gulp-zip');
var config = require('./config.json');



// Create Server

gulp.task('cp:server:dist',function(){
 return gulp.src([config.dist+'/**/*.*'])
 .pipe(gulp.dest(config.p_server));
});

gulp.task('cp:server:style',function(){
 return gulp.src(config.p_server+'style.min.css')
 .pipe(rename('style.css'))
 .pipe(gulp.dest(config.p_server));
});

gulp.task('cp:server:vendorstyle',function(){
 return gulp.src(config.p_server+'vendor.min.css')
 .pipe(rename('vendor.css'))
 .pipe(gulp.dest(config.p_server));
});

gulp.task('cp:server:mainjs',function(){
 return gulp.src([config.p_server_js+'main.min.js',
    'bower_components/analytic.js'])
 .pipe(concat('main.js')) 
 .pipe(uglify())
 .pipe(gulp.dest(config.p_server_js));
});
gulp.task('cp:server:vendorjs',function(){
 return gulp.src(config.p_server_js_vendor+'vendor.min.js')
 .pipe(concat('vendor.js')) 
 .pipe(uglify())
 .pipe(gulp.dest(config.p_server_js_vendor));
});

gulp.task('cp:server:clean', function(){
  del([
    config.p_server+'style.min.css',
    config.p_server+'vendor.min.css',
    config.p_server_js+'main.min.js',
    config.p_server_js_vendor+'vendor.min.js'
    ])
});


// Create Zip 
gulp.task('cp:zip', function () {
    return gulp.src([config.package+'/**/*.*',
        '!'+config.p_server+'/**/*.*'
        ])
        .pipe(zip(config.package+'.zip'))
        .pipe(gulp.dest(''));
});
// Create Dev Stack
gulp.task('cp:stack:dist',function(){
 return gulp.src(['**/*.*',
    '!bower_components/**/*.*',
    '!node_modules/**/*.*',
    '!'+config.images+'**/*.*',
    '!'+config.image_placeholder+'**/*.*',
    '!tasks/package.js',       
    '!'+config.package+'/**/*.*',
    '!'+config.dist+'/**/*.*',
    '!'+config.package+'.zip',
    '!.git/**/*.*'])
 .pipe(gulp.dest(config.p_stack));
});

// Create HTMl Dist
gulp.task('cp:client:dist',function(){
 return gulp.src([
        config.dist+'/**/*.*',
        '!'+config.d_images+'**/*.*'
        ])
 .pipe(gulp.dest(config.p_client));
});

// Plceholders
gulp.task('cp:client:img', function(){
   return gulp.src([config.image_placeholder+'**/*.*'])
   .pipe(gulp.dest(config.p_h_images));
});
gulp.task('cp:stack:img', function(){
   return gulp.src([config.image_placeholder+'**/*.*'])
   .pipe(gulp.dest(config.p_st_images));
});



gulp.task('cp', function() {
  runSequence(
            // Build
            ['styles:b','vendorStyles:b','mainjs:b', 'headjs:b','vendorjs:b','images','extras','htmlcopy:b'],
            // server upload for demo
            ['cp:server:dist'],
            ['cp:server:style','cp:server:vendorstyle','cp:server:mainjs','cp:server:vendorjs'],
            'cp:server:clean',
            //developer stack distribution
            ['cp:stack:dist'],
            'cp:stack:img',
            // build file distribution 
            ['htmlcopy'],
            ['cp:client:dist'],
            'cp:client:img',
            // create Zip
            'cp:zip'
            );
});