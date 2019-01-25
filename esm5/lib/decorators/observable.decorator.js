/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
import * as EventDispatcher from 'polpware-tinymce-tailor/src/util/EventDispatcher';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YWJsZS5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9kZWNvcmF0b3JzL29ic2VydmFibGUuZGVjb3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJBLE9BQU8sS0FBSyxlQUFlLE1BQU0sa0RBQWtELENBQUM7O0lBSTlFLGtCQUFrQixHQUFHLFVBQVMsR0FBRztJQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO1FBQ3ZCLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLGVBQWUsQ0FBQztZQUN2QyxLQUFLLEVBQUUsR0FBRztZQUNWLFdBQVcsRUFBRSxVQUFTLElBQUksRUFBRSxLQUFLO2dCQUM3QixJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFO29CQUN6RCxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUN0QztZQUNMLENBQUM7U0FDSixDQUFDLENBQUM7S0FDTjtJQUVELE9BQU8sR0FBRyxDQUFDLGdCQUFnQixDQUFDO0FBQ2hDLENBQUM7Ozs7Ozs7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQXFDLFdBQWM7SUFDbEY7UUFBcUIsbUNBQVc7UUFBekI7O1FBd0NQLENBQUM7Ozs7Ozs7O1FBdENVLHNCQUFJOzs7Ozs7O1FBQVgsVUFBZSxJQUFZLEVBQUUsR0FBa0IsRUFBRSxNQUFnQjs7Z0JBQ3ZELElBQUksR0FBRyxJQUFJO1lBRWpCLGlGQUFpRjtZQUNqRixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDbkMsT0FBTyxJQUFJLENBQUM7YUFDZjs7Z0JBRUssTUFBTSxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQztZQUUvRCw2QkFBNkI7WUFDN0IsSUFBSSxNQUFNLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7O29CQUM3QixRQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDMUIsT0FBTyxRQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsRUFBRTtvQkFDN0MsUUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNqQyxRQUFNLEdBQUcsUUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUM1QjthQUNKO1lBRUQsT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQzs7Ozs7OztRQUdNLG9CQUFFOzs7Ozs7UUFBVCxVQUFVLElBQVksRUFBRSxRQUFpQyxFQUFFLE9BQWlCO1lBQ3hFLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEUsQ0FBQzs7Ozs7O1FBRU0scUJBQUc7Ozs7O1FBQVYsVUFBVyxJQUFZLEVBQUUsUUFBaUM7WUFDdEQsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hELENBQUM7Ozs7OztRQUVNLHNCQUFJOzs7OztRQUFYLFVBQVksSUFBWSxFQUFFLFFBQWlDO1lBQ3ZELE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6RCxDQUFDOzs7OztRQUVNLG1DQUFpQjs7OztRQUF4QixVQUF5QixJQUFZO1lBQ2pDLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDTCxjQUFDO0lBQUQsQ0FBQyxBQXhDTSxDQUFjLFdBQVcsR0F3QzlCO0FBQ04sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vXHJcbi8vIEF1dGhvcjo6IFRvbSBUYW5nIDxwcmluY2lwbGV3YXJAZ21haWwuY29tPlxyXG4vLyBDb3B5cmlnaHQ6OiBDb3B5cmlnaHQgKGMpIDIwMTcsIFhpYW9sb25nIFRhbmdcclxuLy9cclxuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXHJcbi8vIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxyXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcclxuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxyXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cclxuLy8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXHJcbi8vIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuLy9cclxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcclxuLy8gaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbi8vXHJcbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXHJcbi8vIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxyXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxyXG4vLyBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXHJcbi8vIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cclxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXHJcbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxyXG4vL1xyXG4vLyBFeGNlcHQgYXMgY29udGFpbmVkIGluIHRoaXMgbm90aWNlLCB0aGUgbmFtZShzKSBvZiB0aGUgYWJvdmUgY29weXJpZ2h0XHJcbi8vIGhvbGRlcnMgc2hhbGwgbm90IGJlIHVzZWQgaW4gYWR2ZXJ0aXNpbmcgb3Igb3RoZXJ3aXNlIHRvIHByb21vdGUgdGhlXHJcbi8vIHNhbGUsIHVzZSBvciBvdGhlciBkZWFsaW5ncyBpbiB0aGlzIFNvZnR3YXJlIHdpdGhvdXQgcHJpb3Igd3JpdHRlblxyXG4vLyBhdXRob3JpemF0aW9uLlxyXG5cclxuXHJcbmltcG9ydCAqIGFzIEV2ZW50RGlzcGF0Y2hlciBmcm9tICdwb2xwd2FyZS10aW55bWNlLXRhaWxvci9zcmMvdXRpbC9FdmVudERpc3BhdGNoZXInO1xyXG5cclxuaW1wb3J0IHsgSUV2ZW50QXJncyB9IGZyb20gJy4uL2ludGVyZmFjZXMvZXZlbnQtYXJncy5pbnRlcmZhY2UnO1xyXG5cclxuY29uc3QgZ2V0RXZlbnREaXNwYXRjaGVyID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICBpZiAoIW9iai5fZXZlbnREaXNwYXRjaGVyKSB7XHJcbiAgICAgICAgb2JqLl9ldmVudERpc3BhdGNoZXIgPSBuZXcgRXZlbnREaXNwYXRjaGVyKHtcclxuICAgICAgICAgICAgc2NvcGU6IG9iaixcclxuICAgICAgICAgICAgdG9nZ2xlRXZlbnQ6IGZ1bmN0aW9uKG5hbWUsIHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoRXZlbnREaXNwYXRjaGVyLmlzTmF0aXZlKG5hbWUpICYmIG9iai50b2dnbGVOYXRpdmVFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai50b2dnbGVOYXRpdmVFdmVudChuYW1lLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb2JqLl9ldmVudERpc3BhdGNoZXI7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2YWJsZURlY29yYXRvcjxUIGV4dGVuZHMgeyBuZXcgKC4uLmFyZ3M6IGFueVtdKSB9Pihjb25zdHJ1Y3RvcjogVCkge1xyXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgY29uc3RydWN0b3Ige1xyXG5cclxuICAgICAgICBwdWJsaWMgZmlyZTxVPihuYW1lOiBzdHJpbmcsIGV2dDogSUV2ZW50QXJnczxVPiwgYnViYmxlPzogYm9vbGVhbik6IElFdmVudEFyZ3M8VT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIFByZXZlbnQgYWxsIGV2ZW50cyBleGNlcHQgdGhlIHJlbW92ZSBldmVudCBhZnRlciB0aGUgaW5zdGFuY2UgaGFzIGJlZW4gcmVtb3ZlZFxyXG4gICAgICAgICAgICBpZiAoc2VsZi5yZW1vdmVkICYmIG5hbWUgIT09ICdyZW1vdmUnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3RXZ0ID0gZ2V0RXZlbnREaXNwYXRjaGVyKHNlbGYpLmZpcmUobmFtZSwgZXZ0LCBidWJibGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQnViYmxlIGV2ZW50IHVwIHRvIHBhcmVudHNcclxuICAgICAgICAgICAgaWYgKGJ1YmJsZSAhPT0gZmFsc2UgJiYgc2VsZi5wYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSBzZWxmLnBhcmVudCgpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHBhcmVudCAmJiAhbmV3RXZ0LmlzUHJvcGFnYXRpb25TdG9wcGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuZmlyZShuYW1lLCBuZXdFdnQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXdFdnQ7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIG9uKG5hbWU6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55LCBwcmVwZW5kPzogYm9vbGVhbik6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRFdmVudERpc3BhdGNoZXIodGhpcykub24obmFtZSwgY2FsbGJhY2ssIHByZXBlbmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG9mZihuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRFdmVudERpc3BhdGNoZXIodGhpcykub2ZmKG5hbWUsIGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbmNlKG5hbWU6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldEV2ZW50RGlzcGF0Y2hlcih0aGlzKS5vbmNlKG5hbWUsIGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBoYXNFdmVudExpc3RlbmVycyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldEV2ZW50RGlzcGF0Y2hlcih0aGlzKS5oYXMobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4iXX0=