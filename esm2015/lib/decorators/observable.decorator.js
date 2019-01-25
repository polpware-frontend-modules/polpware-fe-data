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
import * as EventDispatcher from 'polpware-tinymce-tailor/src/util/EventDispatcher';
/** @type {?} */
const getEventDispatcher = function (obj) {
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
const ɵ0 = getEventDispatcher;
/**
 * @template T
 * @param {?} constructor
 * @return {?}
 */
export function observableDecorator(constructor) {
    return class extends constructor {
        /**
         * @template U
         * @param {?} name
         * @param {?} evt
         * @param {?=} bubble
         * @return {?}
         */
        fire(name, evt, bubble) {
            /** @type {?} */
            const self = this;
            // Prevent all events except the remove event after the instance has been removed
            if (self.removed && name !== 'remove') {
                return null;
            }
            /** @type {?} */
            const newEvt = getEventDispatcher(self).fire(name, evt, bubble);
            // Bubble event up to parents
            if (bubble !== false && self.parent) {
                /** @type {?} */
                let parent = self.parent();
                while (parent && !newEvt.isPropagationStopped()) {
                    parent.fire(name, newEvt, false);
                    parent = parent.parent();
                }
            }
            return newEvt;
        }
        /**
         * @param {?} name
         * @param {?} callback
         * @param {?=} prepend
         * @return {?}
         */
        on(name, callback, prepend) {
            return getEventDispatcher(this).on(name, callback, prepend);
        }
        /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        off(name, callback) {
            return getEventDispatcher(this).off(name, callback);
        }
        /**
         * @param {?} name
         * @param {?} callback
         * @return {?}
         */
        once(name, callback) {
            return getEventDispatcher(this).once(name, callback);
        }
        /**
         * @param {?} name
         * @return {?}
         */
        hasEventListeners(name) {
            return getEventDispatcher(this).has(name);
        }
    };
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YWJsZS5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9kZWNvcmF0b3JzL29ic2VydmFibGUuZGVjb3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkEsT0FBTyxLQUFLLGVBQWUsTUFBTSxrREFBa0QsQ0FBQzs7TUFJOUUsa0JBQWtCLEdBQUcsVUFBUyxHQUFHO0lBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7UUFDdkIsR0FBRyxDQUFDLGdCQUFnQixHQUFHLElBQUksZUFBZSxDQUFDO1lBQ3ZDLEtBQUssRUFBRSxHQUFHO1lBQ1YsV0FBVyxFQUFFLFVBQVMsSUFBSSxFQUFFLEtBQUs7Z0JBQzdCLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUU7b0JBQ3pELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3RDO1lBQ0wsQ0FBQztTQUNKLENBQUMsQ0FBQztLQUNOO0lBRUQsT0FBTyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7QUFDaEMsQ0FBQzs7Ozs7OztBQUVELE1BQU0sVUFBVSxtQkFBbUIsQ0FBcUMsV0FBYztJQUNsRixPQUFPLEtBQU0sU0FBUSxXQUFXOzs7Ozs7OztRQUVyQixJQUFJLENBQUksSUFBWSxFQUFFLEdBQWtCLEVBQUUsTUFBZ0I7O2tCQUN2RCxJQUFJLEdBQUcsSUFBSTtZQUVqQixpRkFBaUY7WUFDakYsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQ25DLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7O2tCQUVLLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUM7WUFFL0QsNkJBQTZCO1lBQzdCLElBQUksTUFBTSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFOztvQkFDN0IsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQzFCLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUU7b0JBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDakMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDNUI7YUFDSjtZQUVELE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUM7Ozs7Ozs7UUFHTSxFQUFFLENBQUMsSUFBWSxFQUFFLFFBQWlDLEVBQUUsT0FBaUI7WUFDeEUsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRSxDQUFDOzs7Ozs7UUFFTSxHQUFHLENBQUMsSUFBWSxFQUFFLFFBQWlDO1lBQ3RELE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4RCxDQUFDOzs7Ozs7UUFFTSxJQUFJLENBQUMsSUFBWSxFQUFFLFFBQWlDO1lBQ3ZELE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6RCxDQUFDOzs7OztRQUVNLGlCQUFpQixDQUFDLElBQVk7WUFDakMsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsQ0FBQztLQUNKLENBQUM7QUFDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy9cclxuLy8gQXV0aG9yOjogVG9tIFRhbmcgPHByaW5jaXBsZXdhckBnbWFpbC5jb20+XHJcbi8vIENvcHlyaWdodDo6IENvcHlyaWdodCAoYykgMjAxNywgWGlhb2xvbmcgVGFuZ1xyXG4vL1xyXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcclxuLy8gYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXHJcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xyXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXHJcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xyXG4vLyBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cclxuLy8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG4vL1xyXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxyXG4vLyBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuLy9cclxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcclxuLy8gRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXHJcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXHJcbi8vIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcclxuLy8gTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxyXG4vLyBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cclxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXHJcbi8vXHJcbi8vIEV4Y2VwdCBhcyBjb250YWluZWQgaW4gdGhpcyBub3RpY2UsIHRoZSBuYW1lKHMpIG9mIHRoZSBhYm92ZSBjb3B5cmlnaHRcclxuLy8gaG9sZGVycyBzaGFsbCBub3QgYmUgdXNlZCBpbiBhZHZlcnRpc2luZyBvciBvdGhlcndpc2UgdG8gcHJvbW90ZSB0aGVcclxuLy8gc2FsZSwgdXNlIG9yIG90aGVyIGRlYWxpbmdzIGluIHRoaXMgU29mdHdhcmUgd2l0aG91dCBwcmlvciB3cml0dGVuXHJcbi8vIGF1dGhvcml6YXRpb24uXHJcblxyXG5cclxuaW1wb3J0ICogYXMgRXZlbnREaXNwYXRjaGVyIGZyb20gJ3BvbHB3YXJlLXRpbnltY2UtdGFpbG9yL3NyYy91dGlsL0V2ZW50RGlzcGF0Y2hlcic7XHJcblxyXG5pbXBvcnQgeyBJRXZlbnRBcmdzIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ldmVudC1hcmdzLmludGVyZmFjZSc7XHJcblxyXG5jb25zdCBnZXRFdmVudERpc3BhdGNoZXIgPSBmdW5jdGlvbihvYmopIHtcclxuICAgIGlmICghb2JqLl9ldmVudERpc3BhdGNoZXIpIHtcclxuICAgICAgICBvYmouX2V2ZW50RGlzcGF0Y2hlciA9IG5ldyBFdmVudERpc3BhdGNoZXIoe1xyXG4gICAgICAgICAgICBzY29wZTogb2JqLFxyXG4gICAgICAgICAgICB0b2dnbGVFdmVudDogZnVuY3Rpb24obmFtZSwgc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChFdmVudERpc3BhdGNoZXIuaXNOYXRpdmUobmFtZSkgJiYgb2JqLnRvZ2dsZU5hdGl2ZUV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnRvZ2dsZU5hdGl2ZUV2ZW50KG5hbWUsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvYmouX2V2ZW50RGlzcGF0Y2hlcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZhYmxlRGVjb3JhdG9yPFQgZXh0ZW5kcyB7IG5ldyAoLi4uYXJnczogYW55W10pIH0+KGNvbnN0cnVjdG9yOiBUKSB7XHJcbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBjb25zdHJ1Y3RvciB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBmaXJlPFU+KG5hbWU6IHN0cmluZywgZXZ0OiBJRXZlbnRBcmdzPFU+LCBidWJibGU/OiBib29sZWFuKTogSUV2ZW50QXJnczxVPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgLy8gUHJldmVudCBhbGwgZXZlbnRzIGV4Y2VwdCB0aGUgcmVtb3ZlIGV2ZW50IGFmdGVyIHRoZSBpbnN0YW5jZSBoYXMgYmVlbiByZW1vdmVkXHJcbiAgICAgICAgICAgIGlmIChzZWxmLnJlbW92ZWQgJiYgbmFtZSAhPT0gJ3JlbW92ZScpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXdFdnQgPSBnZXRFdmVudERpc3BhdGNoZXIoc2VsZikuZmlyZShuYW1lLCBldnQsIGJ1YmJsZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBCdWJibGUgZXZlbnQgdXAgdG8gcGFyZW50c1xyXG4gICAgICAgICAgICBpZiAoYnViYmxlICE9PSBmYWxzZSAmJiBzZWxmLnBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHNlbGYucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocGFyZW50ICYmICFuZXdFdnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5maXJlKG5hbWUsIG5ld0V2dCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ld0V2dDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgb24obmFtZTogc3RyaW5nLCBjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnksIHByZXBlbmQ/OiBib29sZWFuKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldEV2ZW50RGlzcGF0Y2hlcih0aGlzKS5vbihuYW1lLCBjYWxsYmFjaywgcHJlcGVuZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb2ZmKG5hbWU6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldEV2ZW50RGlzcGF0Y2hlcih0aGlzKS5vZmYobmFtZSwgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG9uY2UobmFtZTogc3RyaW5nLCBjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0RXZlbnREaXNwYXRjaGVyKHRoaXMpLm9uY2UobmFtZSwgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGhhc0V2ZW50TGlzdGVuZXJzKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0RXZlbnREaXNwYXRjaGVyKHRoaXMpLmhhcyhuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbiJdfQ==