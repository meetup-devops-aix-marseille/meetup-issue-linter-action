<!-- markdownlint-disable-next-line first-line-heading -->
<div align="center" width="100%">
<!-- start branding -->

<img src=".github/ghadocs/branding.svg" width="15%" align="center" alt="branding<icon:check-circle color:blue>" />

<!-- end branding -->
<!-- start title -->

# <img src=".github/ghadocs/branding.svg" width="60px" align="center" alt="branding<icon:check-circle color:blue>" /> GitHub Action: Meetup issue linter action

<!-- end title -->
<!-- start badges -->

<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fcompose-action%2Freleases%2Flatest"><img src="https://img.shields.io/github/v/release/hoverkraft-tech/compose-action?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20tag" /></a>
<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fcompose-action%2Freleases%2Flatest"><img src="https://img.shields.io/github/release-date/hoverkraft-tech/compose-action?display_name=tag&sort=semver&logo=github&style=flat-square" alt="Release%20by%20date" /></a>
<img src="https://img.shields.io/github/last-commit/hoverkraft-tech/compose-action?logo=github&style=flat-square" alt="Commit" />
<a href="https%3A%2F%2Fgithub.com%2Fhoverkraft-tech%2Fcompose-action%2Fissues"><img src="https://img.shields.io/github/issues/hoverkraft-tech/compose-action?logo=github&style=flat-square" alt="Open%20Issues" /></a>
<img src="https://img.shields.io/github/downloads/hoverkraft-tech/compose-action/total?logo=github&style=flat-square" alt="Downloads" />

<!-- end badges -->
</div>
<!-- start description -->

This action lint the meetup issue for required fields and format

<!-- end description -->
<!-- start contents -->
<!-- end contents -->
<!-- start usage -->

```yaml
- uses: hoverkraft-tech/compose-action@v0.0.0
  with:
    # Description: The issue number to lint.
    #
    issue-number: ""

    # Description: The parsed issue body. See <https://github.com/issue-ops/parser>.
    #
    issue-parsed-body: ""

    # Description: Whether to fix the issue or not.
    #
    should-fix: ""

    # Description: The GitHub token with permissions to update the issue.
    #
    github-token: ""
```

<!-- end usage -->
<!-- start inputs -->

| **Input**                      | **Description**                                                   | **Default** | **Required** |
| ------------------------------ | ----------------------------------------------------------------- | ----------- | ------------ |
| <code>issue-number</code>      | The issue number to lint.                                         |             | **true**     |
| <code>issue-parsed-body</code> | The parsed issue body. See <https://github.com/issue-ops/parser>. |             | **true**     |
| <code>should-fix</code>        | Whether to fix the issue or not.                                  |             | **true**     |
| <code>github-token</code>      | The GitHub token with permissions to update the issue.            |             | **true**     |

<!-- end inputs -->
<!-- start outputs -->
<!-- end outputs -->
<!-- start [.github/ghadocs/examples/] -->
<!-- end [.github/ghadocs/examples/] -->
