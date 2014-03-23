plasio
-------------------------------------------------------------------------------

plasio is a project by `Uday Verma`_ and `Howard Butler`_ that implements point
cloud rendering capability in a browser. Specifically, it provides a functional
implementation of the `ASPRS LAS`_ format, and it can consume
`LASzip`_-compressed data using LASzip `NaCl`_ module. Plasio is `Chrome`_-only at
this time, but it is hoped that other contributors can step forward to bring it
to other browsers. 

It is expected that most WebGL-capable browers should be 
able to support plasio, and it contains nothing that is explicitly Chrome-specific beyond the optional NaCL LASzip module. We just haven't tested it beyond `Mac and Windows Chrome Canary`_ at this time.


Demo
...............................................................................

http://plas.io contains a demo of the interface and supports both LAS and LAZ.

FAQ
...............................................................................

What does the name plasio mean?
    
    Nothing.

What are future plans for the software?
    
    We hope that plasio provides a significant enough capability that others 
    start to contribute exploitation and visualization flourishes.

When will it support X, Y, or Z?
    
    The software is its formative stages at this point, and pull 
    requests that provide new capabilities or fix signficant issues 
    are going to be the most persuasive way to impact its future 
    development.

Developers
...............................................................................
Plasio uses the Gulp_ build system::

    npm install -g gulp

To setup the development environment, you can run::

    npm install
    
This will download all dependencies required to setup the build system.
    
You can then build and stage files under the ``build`` directory by running::

    gulp
    
While developing, you may run::
    
    gulp develop
    
This will serve built files locally and open your default browser pointing to the index page.  Any changes you make to
source files will fire gulp tasks that will keep the ``build`` directory up to date. The build system also uses
gulp's live-reload plugin, which works great with `Google Chrome's Live Reload`_ extension.

The gulp file includes a task to publish directly to plas.io, however, you need AWS Access for that to work. You may direct plasio
to your own AWS buckets, in which case you will have to edit ``gulpfile.js`` to direct it likewise.

The publish task looks for ``~/.aws.json`` which should include two fields, ``key`` and ``secret``.

To publish to AWS simply run::

    gulp publish


Credits
...............................................................................

- Blue Marker Icon from `Function Icons`_ By `Liam McKay`_
- High precision GPU point picking wouldn't have been possible without the `Work done here`_.
- `Carlos Scheidegger`_ for GPU float to bytes conversion.


License
...............................................................................

The software is licensed under the permissive `MIT`_ license.

.. _`Howard Butler`: http://github.com/hobu
.. _`Uday Verma`: http://github.com/verma
.. _`Mazira`: http://www.mazira.com
.. _`ASPRS LAS`: http://www.asprs.org/Committee-General/LASer-LAS-File-Format-Exchange-Activities.html
.. _`Chrome`: https://www.google.com/intl/en/chrome/browser/
.. _`LASzip`: http://laszip.org
.. _`NaCl`: https://developers.google.com/native-client/dev/
.. _`MIT`: http://opensource.org/licenses/MIT
.. _`Mac and Windows Chrome Canary`: https://www.google.com/intl/en/chrome/browser/canary.html
.. _`Gulp`: http://gulpjs.com/
.. _`Google Chrome's Live Reload`: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en
.. _`Function Icons`: https://www.iconfinder.com/search/?q=iconset:function_icon_set
.. _`Liam McKay`: http://wefunction.com/contact/
.. _`Work done here`: http://concord-consortium.github.io/lab/experiments/webgl-gpgpu/webgl.html
.. _`Carlos Scheidegger`: http://www.khronos.org/webgl/public-mailing-list/archives/1206/msg00233.html
