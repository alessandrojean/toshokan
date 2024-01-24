# Instructions

Toshokan is a utility aiming to provide a friendly user interface
for better management of your manga, comic and book collection
spreadsheet.

The spreadsheet must follow a strict template, that have to be
copied to your Google Drive account so the application can
have access to it.

The application only reads and writes information on the
spreadsheet, so you still have total control over your collection
data and can have an easy access in case you want to export
or use in other third party service.

## Before starting

Before the first use, you have to create the spreadsheet
file in your Google Drive that will store your collection information.

- Sign in with your Google Account at the [Google Drive] website.
- Access [this sheet] and create a copy by clicking on
  **File → Make a copy**.
- **Do not rename the file**, it should be named **Toshokan**.

In the next time, the copied spreadsheet will be selected automatically.

[Google Drive]: https://drive.google.com/
[this sheet]: #

## Signing in

After you copied the spreadsheet to your Google Drive, you can
start to use Toshokan, by signing in with your Google Account.

- Access the homepage and click on **Sign in with Google**.
- Grant access to the information requested by Toshokan.

In the next time, you will not need to grant the permissions again.

### Usage of your personal information

Toshokan is a open source application and rendered at the browser
side. We do not have a server that store your data and we also
do not share your information with any third party services.

You can remove the granted permissions of access to your Google
Drive files and Google Sheets spreadsheets at any time
on your Google Account settings.

More information can be found in our Privacy Policy.

## Creating the first book

When you sign in by the first time the sheet will be empty,
and you will be asked to create the first book by using the wizard.

If the ISBN search is available, you can search the book you
want to add by typing the ISBN. If the book exists and the code
is valid, you will be taken to the next step with some fields of
the formulary already filled.

![First step: ISBN search.](/images/new-book-step-01.jpg)

The ISBN used to search can be typed with or without the dashes,
and the search also works with old books that have the ISBN
with 10 digits. However, at the moment, the search will only
work with Brazilian books that have the ISBN starting with
**978-85** or **978-65**.

If the search returns no results or the book don't have a
Brazilian ISBN, you can use the **Fill manually** option.

![Second step: fill the book's metadata.](/images/new-book-step-02.jpg)

The book metadata not always is right or follow a pattern, so
you will probably need to fix some minor issues at the data.
In the image above the manga had it title and author filled
with upper case characters, and needs to be fixed.

## The book metadata

Below you will find an brief explanation of each metadata.

ID
: Usually the ISBN of the book, but other unique codes such
  as ISSN or EAN can be used too. In independent publications,
  the **N/A** (not applicable) value can be used.

Title
: Official name of the book. In case of publications with more
  than one volume, you can use the **#** (number sign) character
  followed by the volume/issue number.

  **Example:** Lone Wolf and Cub #01: The Assassin's Road

Authors
: People involved in the creation of the book, such as writers,
  artists, letterers, etc. In case of multiple people, you
  must separate their names by using the **semicolon** character.

  **Example:** Kazuo Koike; Goseki Kojima

Publisher
: Publisher that released the book. Sometimes te value retorned
  by the search is incorrect and the tool will perform a fix,
  but you may still need to modify it manually.

Group
: The group the book has in common with the others in your collection.
  Although ideally it is recommended to use the publication type
  (such as "books", "comics" or "manga"), you can also use
  the name of the franchise in cases with multiple volumes.

  You must always manually fill this metadata.

Size
: Width and height ratio, *in centimeters*. The values can have
  a maximum of one digit in the decimal place.

Label price
: Full price of the book. You can use up to two digits for the
  decimal places.

  In case of imported books, you can change the currency in the
  select field on the side, choosing the equivalent [ISO 4217] code.

Paid price
: Promotional price paid in the book purchase. When not applicable,
  you must fill in the label price value. You can also change
  the currency.

Store
: Place where the book was purchase. You can fill it with the
  **Unknown** value when you don't remember or when you
  don't want to fill it.

Bought at
: Date when the book entered your collection. It is used to
  generate the monthly statistics. If you do not remember
  or do not have this information, you can leave the field
  value blank by erasing the day, month and year at the input.

![Book metadata correctly filled.](/images/new-book-step-03.jpg)

[ISO 4217]: https://en.wikipedia.org/wiki/ISO_4217

## Cover image

After filling the book metadata, you can choose a cover image
automatically obtained from Amazon or from the publisher's website,
or provide a custom valid URL to another image.

If you want to leave the book without a cover image, just do not
select any option and skip to the next step.

![Third step: choosing the cover image.](/images/new-book-step-04.jpg)

## Information review

With all the metadata correct filled and the cover image choosen,
you can do a last review on the information provided before
finishing the wizard and creating the book at the spreadsheet.

![Fourth step: information review.](/images/new-book-step-05.jpg)

If all information is correct, you must click on
**Finish**.

![Creation confirmation dialog.](/images/new-book-step-06.jpg)

With this, the book will be added to the spreadsheet and you
can then choose **View**, if you want to go straight to the
book page, or **New book** if you want to add another book
in sequence.

![Book information page.](/images/new-book-step-07.jpg)

The book is now saved in the spreadsheet and you can repeat
the wizard when you want to add new books. You can explore
your library items via the **Library** item in the main navigation.
