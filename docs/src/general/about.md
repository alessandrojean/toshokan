# About the project

In this page you will find a little more about the project.

## The motivations

The project was created because of many limitations in the existing
manga and comic books collection management websites and apps, such as:

- Outdated design and not being mobile-compatible;
- Watermark in the book covers;
- Slow or broken website;
- Missing better fields for categorization;
- Closed-source and doubtful user privacy;
- No support to mark as read and have a read history.

There also weren't any good tool (offline-based or not) that allowed the user
to have full control over their collection data. Since none of the existing
and well-populated database websites have an public API, the project would
need to depend on manual field filling, but that's a minor issue if you
take in consideration the advantage of being the owner of your collection data.

## The sheet script

The first concept of this tool was built directly in the Google Spreadsheets,
by using their script environment called _Google Apps Script_. It helped
in the creation and edition of the books, but it's bad to view the data
only by a table in the sheet, it was one of the limitations.

Since the beginning, the tool already had the ISBN search and cover finder,
one of the key features that helps a lot to create the records.

## The first version

The first website was built using [Vue.js] (the same framework that is
used in the current version) and [Vuetify] as the UI kit. Although it
worked well, its performance wasn't very good, the UI was bloated
and the app had a bad data management in memory, it just fetched all
the sheet content at once and work locally with it.

[Vue.js]: https://vuejs.org/
[Vuetify]: https://vuetifyjs.com/

## The current version

The current version is more optimized and uses [Tailwind CSS] for the UI.
It is powered by [Vite] and [Netlify]. The data fetching algorithm was
enhanced and it loads much more faster in comparison to the first version.

[Tailwind CSS]: https://tailwindcss.com/
[Vite]: https://vitejs.dev/
[Netlify]: https://www.netlify.com/

## Development

The project is still in Beta stage, so its use to catalogation is limited
to a few beta testers, and we aren't open to new ones at the moment, sorry.

If it wasn't for the beta testers, the project would never be in constant
improvement and optimization. We appreciate a lot the colaboration and feedback.

If you find any bug or issue, we appreciate if you take some time to report
it in our [GitHub repository], by filling one of the issues form.

[GitHub repository]: https://github.com/alessandrojean/toshokan/issues/new/choose/

## Individual donations

If you find the project useful and want to contribute, you can make
a donation through [Ko-fi] or [GitHub Sponsors].
We appreciate it!

[Ko-fi]: https://ko-fi.com/alessandrojean/
[GitHub Sponsors]: https://github.com/sponsors/alessandrojean/

## Business sponsoring

If you have a business related to manga, comics or books (such as an store,
for example) and want to sponsor the project monthly, please open an issue
in our [GitHub repository] about it so we can discuss.

By sponsoring the project, your logo will be included in the `README.md`
file and in the front page and sidebars of the help center, depending
on plan choosed.

We still haven't stablished the available plans, but please keep checking
this page for future updates if you want your business to sponsor the project.

[GitHub repository]: https://github.com/alessandrojean/toshokan/issues/new/choose/
