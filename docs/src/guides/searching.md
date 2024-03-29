# Searching

After you have created some books in your collection, you can search
in your library through the searchbar in the main header.

## Simple mode

Type your query to only search in the _code_, _title_ and _author_ fields.

The search in the sheet will be done with the `OR` logic operator, i.e.,
any books that have matches in at least one of the fields above will
be returned.

Using only the simple mode can cause some issues when you need to
filter the results. For example, imagine you have created in your
collection all the _AKIRA_ and _Dragon Ball_ volumes, and you want
to search for the _AKIRA_ volumes. The search will return you the
right results, but it will also return the _Dragon Ball_ volumes,
since it has a match in the _author_ field (**Akira** Toriyama).
This issue can be solved by using the advanced mode, explained
in the next section.

## Advanced mode

The search in advanced mode allows you to specify which fields
you want the query to be search, and even use some additional
time filters.

The syntax is the same used in many other apps, such as Twitter or Discord.
You have to put the keyword followed by a colon and then the query,
surrounding it with double quotes if it has spaces in it.

Returning to the same example of the previous section, the issue
could be easily solved by searching for `title:akira`, that would
make the search look only in the _title_ field, removing the
_Dragon Ball_ volumes from the results.

In the next section you will find the relation of all keywords
available, followed by how they work individually.

## String keywords

The query parameter of the following keywords **needs to be a string**,
i.e., a text, that needs to be surrounded with double quotes if it
has spaces in it.

| Keyword     | Description                                                 |
| ------------| ----------------------------------------------------------- |
| `id`        | Search for a book with the ID strictly equal to the term.   |
| `code`      | Search for a book with the code strictly equal to the term. |
| `title`     | Search for the term inside the title field.                 |
| `group`     | Search for the term inside the group field.                 |
| `author`    | Search for the term inside the authors field.               |
| `publisher` | Search for the term inside the publisher field.             |
| `store`     | Search for the term inside the store field.                 |
| `notes`     | Search for the term inside the notes field.                 |
| `tag`       | Search for the term inside the tags field.                  |

## Time keywords

The query parameter of the following keywords **needs to be a valid date**
in the formats `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`. It's not necessary
to put the date surrounded by double quotes.

| Keyword          | Description                                           |
| -----------------| ----------------------------------------------------- |
| `bought-at`      | Search for bought books in the date.                  |
| `bought-before`  | Search for bought books before the date (exclusive).  |
| `bought-after`   | Search for bought books after the date (exclusive).   |
| `read-at`        | Search for books read in the date.                    |
| `read-before`    | Search for books read before the date (exclusive).    |
| `read-after`     | Search for books read after the date (exclusive).     |
| `created-at`     | Search for books created in the date.                 |
| `created-before` | Search for books created before the date (exclusive). |
| `created-after`  | Search for books created after the date (exclusive).  |
| `updated-at`     | Search for books updated in the date.                 |
| `updated-before` | Search for books updated before the date (exclusive). |
| `updated-after`  | Search for books updated after the date (exclusive).  |

## Multiple usages

If your search includes multiple keywords that are equal,
their usages can be joined in only a single one, by joining
the terms by a colon.

For example, `publisher:viz publisher:kodansha` can be replaced
by `publisher:viz,kodansha`, and the results will be the same.

## Removing results

All keywords supports their inverse usage (exclusion), by using
it with the minus symbol in the beginning.

For example, using `-publisher:tokyopop` will search for books
that **does not have** the "tokyopop" match in the publisher field.

## Examples

`bought-at:2022-01 group:manga`
: Books in the "manga" group **and** bought in January 2022.

`sword art online group:novels`
: Books that matches "sword art online" in the title **and**
  are in the "novels" group.

`group:manga -publisher:tokyopop`
: Books in the "manga" group **and** aren't from the "tokyopop" publisher.
