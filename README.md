# twittery and twinsert

Two services used to both store and read twitter data using
[`level-agile`][level-agile]

## How to use

export the following as environment variables in your terminal

```sh
export twitter_token=XXXXXXX
export twitter_tokenSecret=XXXXX
export twitter_consumerKey=XXXXXXXXX
export twitter_consumerSecret=XXXXXXX
```

In order to supply all of these values, you must register an app with
[twitter](https://dev.twitter.com/).

Once this is done, just run the file [`bin/level-agile`][level-agile] in
a separate terminal, and then launch the `bin/twinsert` process. This will start
feeding information from twitter into the [`level-agile`][level-agile] database.

[level-agile]: https://github.com/jcrugzz/level-agile
