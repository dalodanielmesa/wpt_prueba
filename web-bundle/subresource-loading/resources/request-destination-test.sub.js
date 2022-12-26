// check-sec-fetch-dest-header-and-return-bundle.py returns a valid format
// bundle only if a 'Sec-Fetch-Dest: webbundle' header is present in a request.
// Otherwise, returns an empty body with 400 status code.
//
// In this wpt, we assume that a <link> element fires a load event correctly if
// a valid format webbundle is returned.

const same_origin_bundle =
  '../resources/check-sec-fetch-dest-header-and-return-bundle.py';
const cross_origin_bundle =
  'https://{{domains[www1]}}:{{ports[https][0]}}/web-bundle/resources/check-sec-fetch-dest-header-and-return-bundle.py';

promise_test(async () => {
  for (const bundle of [same_origin_bundle, cross_origin_bundle]) {
    const element = createWebBundleElement(
        bundle,
        /*resources=*/[]);
    await addElementAndWaitForLoad(element);
    element.remove();
  }
},
'"Sec-Fetch-Dest: webbundle" header must be present in a request for a bundle' +
' with the <link>-based API.');

promise_test(async () => {
  const res = await fetch(same_origin_bundle);
  assert_false(res.ok);
},
'"Sec-Fetch-Dest: webbundle" header must not be present in a fetch request' +
' for a same-origin resource.');

promise_test(async () => {
  const res = await fetch(cross_origin_bundle);
  assert_false(res.ok);
},
'"Sec-Fetch-Dest: webbundle" header must not be present in a fetch request' +
' for a cross-origin resource.');
