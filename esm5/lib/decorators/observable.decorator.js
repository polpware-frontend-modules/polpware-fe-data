/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
//
// Author:: Tom Tang <principleware@gmail.com>
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
import * as dependencies from '@polpware/fe-dependencies';
/** @type {?} */
var EventDispatcher = dependencies.EventDispatcher;
/** @type {?} */
var getEventDispatcher = function (obj) {
    if (!obj._eventDispatcher) {
        obj._eventDispatcher = new EventDispatcher({
            scope: obj,
            toggleEvent: function (name, state) {
                if (EventDispatcher.isNative(name) && obj.toggleNativeEvent) {
                    obj.toggleNativeEvent(name, state);
                }
            }
        });
    }
    return obj._eventDispatcher;
};
var ɵ0 = getEventDispatcher;
/**
 * @template T
 * @param {?} constructor
 * @return {?}
 */
export function observableDecorator(constructor) {
    return /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @template U
         * @param {?} name
         * @param {?} evt
         * @param {?=} bubble
         * @return {?}
         */
        class_1.prototype.fire = /**
         * @template U
         * @param {?} name
         * @param {?} evt
         * @param {?=} bubble
         * @return {?}
         */
        function (name, evt, bubble) {
            /** @type {?} */
            var self = this;
            // Prevent all events except the remove event after the instance has been removed
            if (self.removed && name !== 'remove') {
                return null;
            }
            /** @type {?} */
            var newEvt = getEventDispatcher(self).fire(name, evt, bubble);
            // Bubble event up to parents
            if (bubble !== false && self.parent) {
                /** @type {?} */
                var parent_1 = self.parent();
                while (parent_1 && !newEvt.isPropagationStopped()) {
                    parent_1.fire(name, newEvt, false);
                    parent_1 = parent_1.parent();
                }
            }
            return newEvt;
        };
        /**
         * @param {?} name
         * @param {?} callback
         * @param {?=} prepend
         * @return {?}
         */
        class_1.prototype.on = /**
         * @param {?} name
         * @param {?} callback
         * @param {?=} prepend
         * @return {?}
         */
        function (name, callback, prepend) {
            return getEventDispatcher(this).on(name, callback, prepend);
        };
        /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        class_1.prototype.off = /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        function (name, callback) {
            return getEventDispatcher(this).off(name, callback);
        };
        /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        class_1.prototype.once = /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        function (name, callback) {
            return getEventDispatcher(this).once(name, callback);
        };
        /**
         * @param {?} name
         * @return {?}
         */
        class_1.prototype.hasEventListeners = /**
         * @param {?} name
         * @return {?}
         */
        function (name) {
            return getEventDispatcher(this).has(name);
        };
        return class_1;
    }(constructor));
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YWJsZS5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9kZWNvcmF0b3JzL29ic2VydmFibGUuZGVjb3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLE9BQU8sS0FBSyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7O0lBRXBELGVBQWUsR0FBRyxZQUFZLENBQUMsZUFBZTs7SUFJOUMsa0JBQWtCLEdBQUcsVUFBUyxHQUFHO0lBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7UUFDdkIsR0FBRyxDQUFDLGdCQUFnQixHQUFHLElBQUksZUFBZSxDQUFDO1lBQ3ZDLEtBQUssRUFBRSxHQUFHO1lBQ1YsV0FBVyxFQUFFLFVBQVMsSUFBSSxFQUFFLEtBQUs7Z0JBQzdCLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUU7b0JBQ3pELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3RDO1lBQ0wsQ0FBQztTQUNKLENBQUMsQ0FBQztLQUNOO0lBRUQsT0FBTyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7QUFDaEMsQ0FBQzs7Ozs7OztBQUVELE1BQU0sVUFBVSxtQkFBbUIsQ0FBb0MsV0FBYztJQUNqRjtRQUFxQixtQ0FBVztRQUF6Qjs7UUF3Q1AsQ0FBQzs7Ozs7Ozs7UUF0Q1Usc0JBQUk7Ozs7Ozs7UUFBWCxVQUFlLElBQVksRUFBRSxHQUFrQixFQUFFLE1BQWdCOztnQkFDdkQsSUFBSSxHQUFHLElBQUk7WUFFakIsaUZBQWlGO1lBQ2pGLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUNuQyxPQUFPLElBQUksQ0FBQzthQUNmOztnQkFFSyxNQUFNLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDO1lBRS9ELDZCQUE2QjtZQUM3QixJQUFJLE1BQU0sS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTs7b0JBQzdCLFFBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUMxQixPQUFPLFFBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFO29CQUM3QyxRQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ2pDLFFBQU0sR0FBRyxRQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQzVCO2FBQ0o7WUFFRCxPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDOzs7Ozs7O1FBR00sb0JBQUU7Ozs7OztRQUFULFVBQVUsSUFBWSxFQUFFLFFBQWlDLEVBQUUsT0FBaUI7WUFDeEUsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRSxDQUFDOzs7Ozs7UUFFTSxxQkFBRzs7Ozs7UUFBVixVQUFXLElBQVksRUFBRSxRQUFpQztZQUN0RCxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEQsQ0FBQzs7Ozs7O1FBRU0sc0JBQUk7Ozs7O1FBQVgsVUFBWSxJQUFZLEVBQUUsUUFBaUM7WUFDdkQsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELENBQUM7Ozs7O1FBRU0sbUNBQWlCOzs7O1FBQXhCLFVBQXlCLElBQVk7WUFDakMsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUNMLGNBQUM7SUFBRCxDQUFDLEFBeENNLENBQWMsV0FBVyxHQXdDOUI7QUFDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy9cclxuLy8gQXV0aG9yOjogVG9tIFRhbmcgPHByaW5jaXBsZXdhcmVAZ21haWwuY29tPlxyXG4vLyBDb3B5cmlnaHQ6OiBDb3B5cmlnaHQgKGMpIDIwMTcsIFhpYW9sb25nIFRhbmdcclxuLy9cclxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXHJcbi8vIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxyXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcclxuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxyXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cclxuLy8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXHJcbi8vIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuLy9cclxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcclxuLy8gaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbi8vXHJcbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXHJcbi8vIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxyXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxyXG4vLyBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXHJcbi8vIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cclxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXHJcbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxyXG4vL1xyXG4vLyBFeGNlcHQgYXMgY29udGFpbmVkIGluIHRoaXMgbm90aWNlLCB0aGUgbmFtZShzKSBvZiB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbi8vIGhvbGRlcnMgc2hhbGwgbm90IGJlIHVzZWQgaW4gYWR2ZXJ0aXNpbmcgb3Igb3RoZXJ3aXNlIHRvIHByb21vdGUgdGhlXHJcbi8vIHNhbGUsIHVzZSBvciBvdGhlciBkZWFsaW5ncyBpbiB0aGlzIFNvZnR3YXJlIHdpdGhvdXQgcHJpb3Igd3JpdHRlblxyXG4vLyBhdXRob3JpemF0aW9uLlxyXG5cclxuaW1wb3J0ICogYXMgZGVwZW5kZW5jaWVzIGZyb20gJ0Bwb2xwd2FyZS9mZS1kZXBlbmRlbmNpZXMnO1xyXG5cclxuY29uc3QgRXZlbnREaXNwYXRjaGVyID0gZGVwZW5kZW5jaWVzLkV2ZW50RGlzcGF0Y2hlcjtcclxuXHJcbmltcG9ydCB7IElFdmVudEFyZ3MgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2V2ZW50LWFyZ3MuaW50ZXJmYWNlJztcclxuXHJcbmNvbnN0IGdldEV2ZW50RGlzcGF0Y2hlciA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgaWYgKCFvYmouX2V2ZW50RGlzcGF0Y2hlcikge1xyXG4gICAgICAgIG9iai5fZXZlbnREaXNwYXRjaGVyID0gbmV3IEV2ZW50RGlzcGF0Y2hlcih7XHJcbiAgICAgICAgICAgIHNjb3BlOiBvYmosXHJcbiAgICAgICAgICAgIHRvZ2dsZUV2ZW50OiBmdW5jdGlvbihuYW1lLCBzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKEV2ZW50RGlzcGF0Y2hlci5pc05hdGl2ZShuYW1lKSAmJiBvYmoudG9nZ2xlTmF0aXZlRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoudG9nZ2xlTmF0aXZlRXZlbnQobmFtZSwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9iai5fZXZlbnREaXNwYXRjaGVyO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmFibGVEZWNvcmF0b3I8VCBleHRlbmRzIHsgbmV3KC4uLmFyZ3M6IGFueVtdKSB9Pihjb25zdHJ1Y3RvcjogVCkge1xyXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgY29uc3RydWN0b3Ige1xyXG5cclxuICAgICAgICBwdWJsaWMgZmlyZTxVPihuYW1lOiBzdHJpbmcsIGV2dDogSUV2ZW50QXJnczxVPiwgYnViYmxlPzogYm9vbGVhbik6IElFdmVudEFyZ3M8VT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIFByZXZlbnQgYWxsIGV2ZW50cyBleGNlcHQgdGhlIHJlbW92ZSBldmVudCBhZnRlciB0aGUgaW5zdGFuY2UgaGFzIGJlZW4gcmVtb3ZlZFxyXG4gICAgICAgICAgICBpZiAoc2VsZi5yZW1vdmVkICYmIG5hbWUgIT09ICdyZW1vdmUnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3RXZ0ID0gZ2V0RXZlbnREaXNwYXRjaGVyKHNlbGYpLmZpcmUobmFtZSwgZXZ0LCBidWJibGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQnViYmxlIGV2ZW50IHVwIHRvIHBhcmVudHNcclxuICAgICAgICAgICAgaWYgKGJ1YmJsZSAhPT0gZmFsc2UgJiYgc2VsZi5wYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSBzZWxmLnBhcmVudCgpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHBhcmVudCAmJiAhbmV3RXZ0LmlzUHJvcGFnYXRpb25TdG9wcGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuZmlyZShuYW1lLCBuZXdFdnQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXdFdnQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIG9uKG5hbWU6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55LCBwcmVwZW5kPzogYm9vbGVhbik6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRFdmVudERpc3BhdGNoZXIodGhpcykub24obmFtZSwgY2FsbGJhY2ssIHByZXBlbmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG9mZihuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRFdmVudERpc3BhdGNoZXIodGhpcykub2ZmKG5hbWUsIGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbmNlKG5hbWU6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldEV2ZW50RGlzcGF0Y2hlcih0aGlzKS5vbmNlKG5hbWUsIGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBoYXNFdmVudExpc3RlbmVycyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldEV2ZW50RGlzcGF0Y2hlcih0aGlzKS5oYXMobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4iXX0=