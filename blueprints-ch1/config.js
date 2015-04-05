var config = {
  development: {
    db_url: 'mongodb://localhost/chapter01',
    sessionDb: 'mongodb://localhost/chapter01_sessions',
    domain: 'localhost'
  },
  test: {
    db_url: 'mongodb://localhost/chapter01_test',
    sessionDb: 'mongodb://localhost/chapter01_sessions_test',
    domain: 'localhost'
  },
  production: {
    db_url: process.env.MONGOLAB_URI,
    sessionDb: process.env.MONGOLAB_URI,
    domain: 'baugarten-chapter01.herokuapp.com'
  }
};

var common = {
  twitter: {
    consumerKey: process.env.TWITTER_KEY || 'VRE4lt1y0W3yWTpChzJHcAaVf',
    consumerSecret: process.env.TWITTER_SECRET  || 'TOA4rNzv9Cn8IwrOi6MOmyV894hyaJks6393V6cyLdtmFfkWqe',
    callbackURL: '/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '627474771522-uskkhdsevat3rn15kgrqt62bdft15cpu.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'FwVkn76DKx_0BBaIAmRb6mjB',
    callbackURL: '/auth/google/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || '81b233b3394179bfe2bc',
    clientSecret: process.env.GITHUB_SECRET || 'de0322c0aa32eafaa84440ca6877ac5be9db9ca6',
    callbackURL: '/auth/github/callback'
  }
};

// For all environments, add common properties
for (var commonkey in common) {
  for (var key in config) {
    config[key][commonkey] = common[commonkey];
  }
}

module.exports = function() {
  return config[process.env.NODE_ENV || 'development'];
};
