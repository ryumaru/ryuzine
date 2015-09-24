# How to Contribute

## Getting Started
* Make sure you have a [GitHub account](https://github.com/signup/free)
* Read the [Open Source Code of Conduct](http://www.ryumaru.com/open-source-code-of-conduct/)
* Search Issues to see if your issue has already been addressed and
* Report your issue (assuming it did not already exist)
  * Clearly describe the issue including steps to reproduce it.
  * Make sure you fill in the earliest version that you know has the issue.
* Fork the repository on GitHub

## Making Changes
* Create a topic branch from where you want to base your work
  * This will usually be the Master Branch.
  * Only target other branches if you are certain your fix must be on that branch.
  * Please avoid working directly on the Master Branch!
* Make commits of logical units
* Make sure your commit messages are in the proper format and include a Developer Certificate of Origin sign-off (see below).

### Documentation

For changes to comments and documentation, it is not always necessary to create a new issue.  In this case it is appropriate to start the first line of a commit with ‘DOCS’.  Documentation contributions also require a proper sign-off in your commit message.

## Pull requests:

Changes to this project should be proposed as pull requests on Github.

Proposed changes will then go through code review there and once approved,
be merged in the main branch.  There is no timeline for merges or releases.


## Intellectual Property License:

By default, any contribution to a Ryu Maru project is made under the same license included in the project’s respective repository.

The author of a change remains the copyright holder of their code.  The copyright holder grants license for contributions to be used in the project, this is not an assignment of rights to the project.

## Rebadged and Derivative Versions

Before you create a derivative or custom version ask yourself if you really need to do so.    Changing the branding to your own logos and icons is a built-in feature.  Themes allow you to conform the look and feel to your other publications.  Add-Ons allow you to expand the webapps with new functionality.  You are not required to publicly release any custom themes or add-ons you create.

To change branding add an “#applogo” element with an image and swap out app icons with your own (Ryuzine Press allows you to simply select images from your WordPress media library, Ryuzine Rack also allows individual data catalogs to have a “Masthead” branding image).  Other elements can be altered using a custom theme.  However, the webapps are still identified as “Ryuzine” in the “About” dialog, copyright notices, and code.

If you fork the project(s) into a new project you MUST de-brand/re-brand all user-facing elements.  The “Ryuzine” name, logo, and the Ryu Maru logos are trademarked properties.  The Ryuzine app icons are copyrighted designs licensed only for use in conjunction with the original webapps.  If you have maintained compatibility with Ryuzine Add-Ons and Themes you may include wording to that effect in the webapp(s) and/or other materials.

Publications in Ryuzine format are **not** considered derivative works of the Ryuzine webapp itself.


# Developer Certificate of Origin:

To improve tracking of contributions to this project we use the DCO 1.1
and use a "sign-off" procedure for all changes going into the branch.

The sign-off is a simple line at the end of the explanation for the
commit which certifies that you wrote it or otherwise have the right
to pass it on as an open-source contribution.

> Developer Certificate of Origin
> Version 1.1
>
> Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
> 660 York Street, Suite 102,
> San Francisco, CA 94110 USA
>
> Everyone is permitted to copy and distribute verbatim copies of this
> license document, but changing it is not allowed.
>
> Developer's Certificate of Origin 1.1
>
> By making a contribution to this project, I certify that:
>
> (a) The contribution was created in whole or in part by me and I
>     have the right to submit it under the open source license
>     indicated in the file; or
>
> (b) The contribution is based upon previous work that, to the best
>     of my knowledge, is covered under an appropriate open source
>     license and I have the right under that license to submit that
>     work with modifications, whether created in whole or in part
>     by me, under the same open source license (unless I am
>     permitted to submit under a different license), as indicated
>     in the file; or
>
> (c) The contribution was provided directly to me by some other
>     person who certified (a), (b) or (c) and I have not modified
>     it.
>
> (d) I understand and agree that this project and the contribution
>     are public and that a record of the contribution (including all
>     personal information I submit with it, including my sign-off) is
>     maintained indefinitely and may be redistributed consistent with
>     this project or the open source license(s) involved.

## How to Sign Off on the DCO

When you commit you can just use:
``
git commit -s
``
or
``
git commit —signoff
``
Or just write at the end, on a line by itself separated by a blank line from the body of your commit message:

    Signed-off-by: John D. Developer <jon_d@developer.org>

Use your REAL NAME and a valid e-mail address (sorry, no pseudonyms or anonymous contributions are allowed, the e-mail address does not have to be the same one associated with your GitHub account).

We also require EACH COMMIT be individually signed-off by their author,
even when part of a larger set.

You do NOT need to include a copy of the Developer Certificate of Origin (DCO) text with each commit message or within the contributed code.  The simple sign-off is all that’s required and indicates you have read and agreed to the DCO.

### Signing on Behalf of Your Employer

If you are contributing code for which your employer is the copyright holder, including but not limited to original code written by you that may be considered a “work-for-hire,” you will first need to get permission from your employer before you can contribute.

* Copy the text of the Developer Certificate of Origin (DCO) above into an e-mail
* Have whomever at your company is authorized to grant copyright license sign off at the bottom and sign off on it yourself. 
* Have that e-mail sent from your company e-mail address to software@ryumaru.com.  A copy of the text of that e-mail will be kept on record.
* Whenever making a commit sign-off at the end using your REAL NAME and the same e-mail address you used to send the DCO (this does not have to be the same address associated with your GitHub account).
* Any code contributed on behalf of your employer may contain copyright notices such as “(c) 2015 Example Corporation.”
* If you change employers and no longer represent that company you must not continue to contribute code using the company e-mail address in your sign-off.  You will need to either contribute as an individual or go through this process again with your new employer (depending on whether you, or your employer, owns the copyright to any code you contribute).