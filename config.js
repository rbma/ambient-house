'use strict';

module.exports = {
    
    'browserPort': 9000,
    'UIPort': 9001,
    'serverPort': 9002,

    'lib': {
        'src': 'app/lib/**/*.js',
        'dest': 'build/lib'
    },

    'audio': {
        'src': 'app/audio/**/*',
        'dest': 'build/audio'
    },

    'styles': {
        'src': 'app/styles/**/*.scss',
        'dest': 'build/css'
    },

    'scripts': {
        'src': ['app/scripts/**/*.js'],
        'dest': 'build/js',
        'main': 'app/scripts/main.js'
    },

    'html': {
        'src': 'app/**/*.html',
        'dest': 'build'
    },

    'views': {
        'src': 'app/**/*.jade',
        'dest': 'build'
    },

    'lib': {
        'src': 'app/lib/**/*',
        'dest': 'build/lib'
    },

    'images': {
        'src': 'app/images/**/*',
        'dest': 'build/images'
    },

    'fonts': {
        'src': 'app/fonts/**/*',
        'dest': 'build/fonts'
    },

    'dist': {
        'root': 'build'
    },

    'data': {
        'src': 'app/data/**/*',
        'dest': 'build/data'
    },

    'icons': {
        'src': 'app/icons/*',
        'dest': 'build/icons'
    },

    'lib': {
        'src': 'app/lib/**/*',
        'dest': 'build/lib'
    },

    'src': 'app/',

    extras: ['app/robots.txt', 'app/favicon.ico', 'app/icons/*']
};