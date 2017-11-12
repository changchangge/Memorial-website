//引入gulp工具
var gulp = require('gulp');
//载入gulp模块
fileInclude = require('gulp-file-include'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
clean = require('gulp-clean'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
cache = require('gulp-cache'),
livereload = require('gulp-livereload')
watch = require('gulp-watch')
browserSync = require('browser-sync'); 

//html文件
gulp.task('html',function() {
  gulp.src('html/*.html')
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulp.dest('dist'))
  gulp.src(['html/pages/**','!html/pages/main*'])
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulp.dest('dist/pages'))
    .pipe(notify({ message: 'Html tasks complete.' })); //返回成功提示
});

//样式
gulp.task('style',function() {
  return gulp.src('scss/main.scss')
    .pipe(sass({ style:'expanded' }))  //编译sass
    .pipe(autoprefixer('last 2 version','safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))  //添加浏览器前缀
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'})) //重命名
    .pipe(minifycss()) //压缩
    .pipe(gulp.dest('dist/css')) //输出压缩文件
    .pipe(notify({ message: 'Styles task complete.' }));
});

//脚本
gulp.task('script', function () { 
  return gulp.src('js/*.js')  //匹配所有js目录下的js文件
    .pipe(jshint()) //检测代码错误和潜在问题
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))  //合并所有js到main.js中
    .pipe(gulp.dest('dist/js')) //保存在dist/js文件夹下
    .pipe(rename({suffix: '.min'})) //重命名
    .pipe(uglify()) //压缩代码
    .pipe(gulp.dest('dist/js')) //保存压缩文件在dist/js下面
    .pipe(notify({ message: 'Scripts task complete.' })); //返回成功提示
});

//图片压缩
gulp.task('image',function() {
  return gulp.src('images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete.' }));
});

//清除目录重建文件
gulp.task('clean', function() {  
  return gulp.src(['dist/*.html','dist/pages','dist/css', 'dist/js', 'dist/images'], {read: false})
    .pipe(clean());
});

//建立预设任务，只输入gulp时执行
gulp.task('default',function() {  
    gulp.start('html','style', 'script', 'image');
});

//监视所有文件
gulp.task('abs',function() {
  console.log('res is res');
  gulp.watch('dist/index.html',['html']);
});
gulp.task('watch',function() {
  gulp.watch('html/*.html',['html']);
  gulp.watch('scss/**/*.scss',['style']);
  gulp.watch('js/*.js',['script']);
  gulp.watch('images/**/*.*',['image']);
  var server = livereload();
  gulp.watch(['dist/**']).on('change', function(file) {
    server.changed(file.path);
  });
});

//浏览器同步
gulp.task('sync', function () { 
  var files = [ 
    'dist/*.html', 
    'dist/css/*.css', 
    'dist/images/*.png', 
    'dist/js/*.js' 
  ];
  browserSync.init(files, { 
    server: { 
      baseDir: './dist' 
    } 
  }); 
});

