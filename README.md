# SnapTest CLI Tool:
 
SnapTest's cli tool to generate a test code folder.  Digests SnapTest JSON and outputs a folder of tests that can be run in a variety of languages/frameworks.
 
## Install:

```
npm install -g snaptest-cli
```

## Current official generators & styles:

1. `nightwatch`:  Generates code in the popular nightwatchJS framework. [generator repository](https://github.com/snaptest-io/csharp-generator), [project harness](https://github.com/snaptest-io/nightwatch-harness)
1. `csharp`  Generates code in C#.  [generator repository](https://github.com/snaptest-io/csharp-generator)
   * NUnit style: `nunit` [project scaffold/harness](https://github.com/snaptest-io/csharpnunit-harness)
   * XUnit style: `xunit` [project scaffold/harness](https://github.com/snaptest-io/csharpxunit-harness)

*Each generator is accompanied by a project harness repository that will help you get setup with configuring/running your tests.*

Want another language/framework generator?  Let us know in the [github issues section here](https://github.com/snaptest-io/snaptest-cli/issues).

## Cloud vs Local mode.

- If you're utilizing SnapTest cloud, the cli will pull your test JSON directly from your cloud account via your access token and account flags. 
- If you're only using "local" only, You can specify your test json via the `-i <path to test JSON file>` flag.

## Quick usage:

From the SnapTest extensions dashboard, find the "code" icon/button next to the corresponding test folder. Follow the on-screen commands to copy a command into your terminal which will generate the folder and tests with your specifications. 

## Reference

#### General flags:

***These are most easily obtained by clicking on the "generate code" icons above tests or folders and copying/pasting the generated command.***

1. Generate only folder: `-f <folderId>` - Generates only the specified folder.
1. Output folder name: `-o <test folder name>` - Lets you name the test folder whatever you'd like.  It defaults to `snaptests`.
1. Framework type: `-r <offical framework/language>` - Generates tests in any of the offical frameworks. e.g. `nightwatchjs` or `csharp`.  
1. Style: `-s <offical style>` - Generates tests with specified style. e.g. for the csharp type, `xunit` or `nunit` are available.  
1. Local JSON resource: `-i <path to test JSON file>` - Specify a path to a local json file that you have exported via the SnapTest extension.
1. Custom generator: `-c <path to custom generator index.js>` - Specify a path to the index.js file of your custom generator.  for more information, [see custom generator docs](https://www.snaptest.io/doc/custom-generators).  

#### Cloud access flags:

These are only required if you're utilizing the SnapTest cloud.  Not required if you're generating from a local .json tests file.  

***These are most easily obtained by clicking on the "generate code" icons above tests or folders.***

1. Access token: `-t <access token>` - Used to access your resources on the SnapTest Cloud.  Not required if you're generating from a local .json file.
1. Account type: `-a <account type>` - Specify the type of account you're accessing.  Can be `user`, `org`, or `project`
1. Account id: `-a <account id>` - Specify the id of the account.  

## Requirements:

1. MacOS (Windows coming soon)
1. Node 4+