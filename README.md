# firebase-profiler-tree
This code takes the RAW output of database:profile on firebase-tools and shows data as tree view

# side-note
This project started as an Electron application. But as I wrote the app, I realized that it may not by essential to use Electron.

# introduction
Google Firebase Realtime Database comes with a profiler tool which can be downloaded from there:

https://github.com/firebase/firebase-tools

It's run with the following commands:

firebase database:profile [--raw] [--no-collapse]

The output without the --raw parameter shows a nice summary of the data in a table view. But it collapse some data, so according to your data depth, it can be useless.

With the --co-collapse parameter, all the data is flattened. It's then hard to focus on where a high load can be.

With the --raw parameter, the data is difficult to analyze.

So I made this program that takes the raw output and shows it as a treeview.

For now, it's very basic. For it can be usefull.
