/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
//
// Author:: Tom Tang <principlewar@gmail.com>
// Copyright:: Copyright (c) 2017, Xiaolong Tang
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// Except as contained in this notice, the name(s) of the above copyright
// holders shall not be used in advertising or otherwise to promote the
// sale, use or other dealings in this Software without prior written
// authorization.
/**
 * @record
 * @template T
 */
export function ICacheBackend() { }
if (false) {
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    ICacheBackend.prototype.set = function (key, value) { };
    /**
     * @param {?} key
     * @return {?}
     */
    ICacheBackend.prototype.get = function (key) { };
    /**
     * @param {?} key
     * @return {?}
     */
    ICacheBackend.prototype.remove = function (key) { };
    /**
     * @param {?} key
     * @return {?}
     */
    ICacheBackend.prototype.length = function (key) { };
    /**
     * @param {?} index
     * @return {?}
     */
    ICacheBackend.prototype.key = function (index) { };
    /**
     * @return {?}
     */
    ICacheBackend.prototype.enabled = function () { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtYmFja2VuZC5pbnRlcmZhY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9jYWNoZS9jYWNoZS1iYWNrZW5kLmludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCQSxtQ0FhQzs7Ozs7OztJQVhHLHdEQUF5Qzs7Ozs7SUFFekMsaURBQW9DOzs7OztJQUVwQyxvREFBeUI7Ozs7O0lBRXpCLG9EQUE0Qjs7Ozs7SUFFNUIsbURBQTJCOzs7O0lBRTNCLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8vXHJcbi8vIEF1dGhvcjo6IFRvbSBUYW5nIDxwcmluY2lwbGV3YXJAZ21haWwuY29tPlxyXG4vLyBDb3B5cmlnaHQ6OiBDb3B5cmlnaHQgKGMpIDIwMTcsIFhpYW9sb25nIFRhbmdcclxuLy9cclxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXHJcbi8vIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxyXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcclxuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxyXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cclxuLy8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXHJcbi8vIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuLy9cclxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcclxuLy8gaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbi8vXHJcbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXHJcbi8vIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxyXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxyXG4vLyBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXHJcbi8vIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cclxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXHJcbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxyXG4vL1xyXG4vLyBFeGNlcHQgYXMgY29udGFpbmVkIGluIHRoaXMgbm90aWNlLCB0aGUgbmFtZShzKSBvZiB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbi8vIGhvbGRlcnMgc2hhbGwgbm90IGJlIHVzZWQgaW4gYWR2ZXJ0aXNpbmcgb3Igb3RoZXJ3aXNlIHRvIHByb21vdGUgdGhlXHJcbi8vIHNhbGUsIHVzZSBvciBvdGhlciBkZWFsaW5ncyBpbiB0aGlzIFNvZnR3YXJlIHdpdGhvdXQgcHJpb3Igd3JpdHRlblxyXG4vLyBhdXRob3JpemF0aW9uLlxyXG5cclxuXHJcbi8vIFRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlIG1vZGVscyB0aGUgcmVxdWlyZW1lbnRzIG9uIHRoZSBiYWNrZW5kXHJcbi8vIGZvciBsb2NhY2hlLlxyXG5leHBvcnQgaW50ZXJmYWNlIElDYWNoZUJhY2tlbmQ8VD4ge1xyXG5cclxuICAgIHNldChrZXk6IHN0cmluZywgdmFsdWU6IFQgfCBudW1iZXIpOiBhbnk7XHJcblxyXG4gICAgZ2V0KGtleTogc3RyaW5nKTogVCB8IG51bWJlciB8IG51bGw7XHJcblxyXG4gICAgcmVtb3ZlKGtleTogc3RyaW5nKTogYW55O1xyXG5cclxuICAgIGxlbmd0aChrZXk6IHN0cmluZyk6IG51bWJlcjtcclxuXHJcbiAgICBrZXkoaW5kZXg6IG51bWJlcik6IHN0cmluZztcclxuXHJcbiAgICBlbmFibGVkKCk6IGJvb2xlYW47XHJcbn1cclxuIl19