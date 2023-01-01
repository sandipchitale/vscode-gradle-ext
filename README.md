# vscode-gradle-ext README

Extends Gradle for Java VSCode extension.

**NEW:** Use ```vscode-gradle-ext.groovysh``` to run ```groovysh``` in the context of the gradle build.
**NEW:** Once the groovysh is launched try the following command:

```
Groovy Shell (3.0.9, JVM: 11.0.14.1)
Type ':help' or ':h' for help.
-------------------------------------------------------------------------------
groovy:000> ObjectBrowser.inspect(project)
```

to launch a treetable based ObjectBrowser UI:

![ObjectBrowserTreeTable](images/ObjectBrowserTreeTable.png)

A Tree Table UI based Object Browser is shown. Hovering over the cells shows tooltip. ```CTRL+BUTTON3``` click copies the value to clipboard.

## Features

|Name|Description|Contexts|
|-|-|-|
|vscode-gradle-ext.dependencyUpdates|Show Dependency Updates Report|Gradle Projects view title|
|vscode-gradle-ext.explorer|         Explorer                 |Gradle Projects view title|
|vscode-gradle-ext.groovysh|         Start groovysh in build context|Gradle Projects view title|
|vscode-gradle-ext.tiOrder|          Task order               |Gradle Projects view task item|
|vscode-gradle-ext.tiTree|           Task tree                |Gradle Projects view task item|
|vscode-gradle-ext.copyName|         Copy Name                |Gradle Projects view task item|
|vscode-gradle-ext.copyPath|         Copy Path                |Gradle Projects view task item|
|vscode-gradle-ext.helpTask|         Help Task                |Gradle Projects view task item|
|vscode-gradle-ext.dependencyInsight|Dependency Insight (Invoke on Dependency node only)|Gradle Projects view dependency item|
|vscode-gradle-ext.dependenciesConfiguration|Dependencies for Configuration (Invoke on Configuration node only)|Gradle Projects view configuration item|
|vscode-gradle-ext.copyLabel|        Copy Label               |Gradle Projects view tree item|

## Requirements

## Extension Settings

## Known Issues

## Release Notes

### 1.0.34

Initial release.
