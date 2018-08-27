# SnapTest CLI Tool:
 
SnapTest's cli tool to generate a test code folder.  Digests SnapTest JSON and outputs a folder of tests that can be run in a variety of languages/frameworks.
 
## Install:

```
npm install -g snaptest-cli
```

## Current official generators:

1. `nightwatch`:  Generates code in the popular nightwatchJS framework. [generator repository](https://github.com/ozymandias547/csharpnunit), [project harness](https://github.com/ozymandias547/snaptest-harness)
1. `csharpnunit`  Generates code in C# using the nunit testing framework.  [generator repository](https://github.com/ozymandias547/csharpnunit), [project harness](https://github.com/ozymandias547/snaptest-harness)

*Each generator is accompanied by a project harness repository that will help you get setup with configuring/running your tests.*

Want another language/framwork generator?  Let us know in the [github issues section here](https://github.com/ozymandias547/snaptest-cli/issues).

## Cloud vs Local mode.

- If you're utilizing SnapTest cloud, the cli will pull your test JSON directly from your cloud account via your access token and account flags. 
- If you're only using "local" only, You can specify your test json via the `-i <path to test JSON file>` flag.

## Quick usage:

From the SnapTest extensions dashboard, find the "code" button next to the corresponding test folder.  Copy and paste the displayed command into your terminal to generate the folder and tests within. 

![alt text](placeholder "Logo Title Text 1")
![alt text](placeholder "Logo Title Text 1")

## Reference

#### General flags:

***These are most easily obtained by clicking on the "generate code" icons above tests or folders and copying/pasting the generated command.***

1. Generate only folder: `-f <folderId>` - Generates only the specified folder.
1. Output folder name: `-o <test folder name>` - Lets you name the test folder whatever you'd like.  It defaults to `snaptests`.
1. Framework type: `-r <offical framework>` - Generates tests in any of the offical frameworks. e.g. `nightwatchjs` or `csharpnunit`.  
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