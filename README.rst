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