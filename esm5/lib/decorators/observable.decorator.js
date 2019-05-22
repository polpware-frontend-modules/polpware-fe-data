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
import * as tslib_1 from "tslib";
import * as dependencies from '@polpware/fe-dependencies';
var EventDispatcher = dependencies.EventDispatcher;
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
export function observableDecorator(constructor) {
    return /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.fire = function (name, evt, bubble) {
            var self = this;
            // Prevent all events except the remove event after the instance has been removed
            if (self.removed && name !== 'remove') {
                return null;
            }
            var newEvt = getEventDispatcher(self).fire(name, evt, bubble);
            // Bubble event up to parents
            if (bubble !== false && self.parent) {
                var parent_1 = self.parent();
                while (parent_1 && !newEvt.isPropagationStopped()) {
                    parent_1.fire(name, newEvt, false);
                    parent_1 = parent_1.parent();
                }
            }
            return newEvt;
        };
        class_1.prototype.on = function (name, callback, prepend) {
            return getEventDispatcher(this).on(name, callback, prepend);
        };
        class_1.prototype.off = function (name, callback) {
            return getEventDispatcher(this).off(name, callback);
        };
        class_1.prototype.once = function (name, callback) {
            return getEventDispatcher(this).once(name, callback);
        };
        class_1.prototype.hasEventListeners = function (name) {
            return getEventDispatcher(this).has(name);
        };
        return class_1;
    }(constructor));
}
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YWJsZS5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9kZWNvcmF0b3JzL29ic2VydmFibGUuZGVjb3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEVBQUU7QUFDRiw4Q0FBOEM7QUFDOUMsZ0RBQWdEO0FBQ2hELEVBQUU7QUFDRix3RUFBd0U7QUFDeEUsa0VBQWtFO0FBQ2xFLHNFQUFzRTtBQUN0RSxzRUFBc0U7QUFDdEUscUVBQXFFO0FBQ3JFLHdFQUF3RTtBQUN4RSw0QkFBNEI7QUFDNUIsRUFBRTtBQUNGLGlFQUFpRTtBQUNqRSxrRUFBa0U7QUFDbEUsRUFBRTtBQUNGLGtFQUFrRTtBQUNsRSxxRUFBcUU7QUFDckUsd0RBQXdEO0FBQ3hELHlFQUF5RTtBQUN6RSx5RUFBeUU7QUFDekUsd0VBQXdFO0FBQ3hFLGtFQUFrRTtBQUNsRSxFQUFFO0FBQ0YseUVBQXlFO0FBQ3pFLHVFQUF1RTtBQUN2RSxxRUFBcUU7QUFDckUsaUJBQWlCOztBQUVqQixPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELElBQU0sZUFBZSxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUM7QUFJckQsSUFBTSxrQkFBa0IsR0FBRyxVQUFTLEdBQUc7SUFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN2QixHQUFHLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLENBQUM7WUFDdkMsS0FBSyxFQUFFLEdBQUc7WUFDVixXQUFXLEVBQUUsVUFBUyxJQUFJLEVBQUUsS0FBSztnQkFDN0IsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRTtvQkFDekQsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDdEM7WUFDTCxDQUFDO1NBQ0osQ0FBQyxDQUFDO0tBQ047SUFFRCxPQUFPLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNoQyxDQUFDLENBQUM7O0FBRUYsTUFBTSxVQUFVLG1CQUFtQixDQUFvQyxXQUFjO0lBQ2pGO1FBQXFCLG1DQUFXO1FBQXpCOztRQXdDUCxDQUFDO1FBdENVLHNCQUFJLEdBQVgsVUFBZSxJQUFZLEVBQUUsR0FBa0IsRUFBRSxNQUFnQjtZQUM3RCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7WUFFbEIsaUZBQWlGO1lBQ2pGLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUNuQyxPQUFPLElBQUksQ0FBQzthQUNmO1lBRUQsSUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFaEUsNkJBQTZCO1lBQzdCLElBQUksTUFBTSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNqQyxJQUFJLFFBQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQzNCLE9BQU8sUUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUU7b0JBQzdDLFFBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDakMsUUFBTSxHQUFHLFFBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDNUI7YUFDSjtZQUVELE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFHTSxvQkFBRSxHQUFULFVBQVUsSUFBWSxFQUFFLFFBQWlDLEVBQUUsT0FBaUI7WUFDeEUsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBRU0scUJBQUcsR0FBVixVQUFXLElBQVksRUFBRSxRQUFpQztZQUN0RCxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVNLHNCQUFJLEdBQVgsVUFBWSxJQUFZLEVBQUUsUUFBaUM7WUFDdkQsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFTSxtQ0FBaUIsR0FBeEIsVUFBeUIsSUFBWTtZQUNqQyxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0wsY0FBQztJQUFELENBQUMsQUF4Q00sQ0FBYyxXQUFXLEdBd0M5QjtBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvL1xyXG4vLyBBdXRob3I6OiBUb20gVGFuZyA8cHJpbmNpcGxld2FyZUBnbWFpbC5jb20+XHJcbi8vIENvcHlyaWdodDo6IENvcHlyaWdodCAoYykgMjAxNywgWGlhb2xvbmcgVGFuZ1xyXG4vL1xyXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcclxuLy8gYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXHJcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xyXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXHJcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xyXG4vLyBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cclxuLy8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG4vL1xyXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxyXG4vLyBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuLy9cclxuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcclxuLy8gRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXHJcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXHJcbi8vIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcclxuLy8gTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxyXG4vLyBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cclxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXHJcbi8vXHJcbi8vIEV4Y2VwdCBhcyBjb250YWluZWQgaW4gdGhpcyBub3RpY2UsIHRoZSBuYW1lKHMpIG9mIHRoZSBhYm92ZSBjb3B5cmlnaHRcclxuLy8gaG9sZGVycyBzaGFsbCBub3QgYmUgdXNlZCBpbiBhZHZlcnRpc2luZyBvciBvdGhlcndpc2UgdG8gcHJvbW90ZSB0aGVcclxuLy8gc2FsZSwgdXNlIG9yIG90aGVyIGRlYWxpbmdzIGluIHRoaXMgU29mdHdhcmUgd2l0aG91dCBwcmlvciB3cml0dGVuXHJcbi8vIGF1dGhvcml6YXRpb24uXHJcblxyXG5pbXBvcnQgKiBhcyBkZXBlbmRlbmNpZXMgZnJvbSAnQHBvbHB3YXJlL2ZlLWRlcGVuZGVuY2llcyc7XHJcblxyXG5jb25zdCBFdmVudERpc3BhdGNoZXIgPSBkZXBlbmRlbmNpZXMuRXZlbnREaXNwYXRjaGVyO1xyXG5cclxuaW1wb3J0IHsgSUV2ZW50QXJncyB9IGZyb20gJy4uL2ludGVyZmFjZXMvZXZlbnQtYXJncy5pbnRlcmZhY2UnO1xyXG5cclxuY29uc3QgZ2V0RXZlbnREaXNwYXRjaGVyID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICBpZiAoIW9iai5fZXZlbnREaXNwYXRjaGVyKSB7XHJcbiAgICAgICAgb2JqLl9ldmVudERpc3BhdGNoZXIgPSBuZXcgRXZlbnREaXNwYXRjaGVyKHtcclxuICAgICAgICAgICAgc2NvcGU6IG9iaixcclxuICAgICAgICAgICAgdG9nZ2xlRXZlbnQ6IGZ1bmN0aW9uKG5hbWUsIHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoRXZlbnREaXNwYXRjaGVyLmlzTmF0aXZlKG5hbWUpICYmIG9iai50b2dnbGVOYXRpdmVFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai50b2dnbGVOYXRpdmVFdmVudChuYW1lLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb2JqLl9ldmVudERpc3BhdGNoZXI7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2YWJsZURlY29yYXRvcjxUIGV4dGVuZHMgeyBuZXcoLi4uYXJnczogYW55W10pIH0+KGNvbnN0cnVjdG9yOiBUKSB7XHJcbiAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBjb25zdHJ1Y3RvciB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBmaXJlPFU+KG5hbWU6IHN0cmluZywgZXZ0OiBJRXZlbnRBcmdzPFU+LCBidWJibGU/OiBib29sZWFuKTogSUV2ZW50QXJnczxVPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgLy8gUHJldmVudCBhbGwgZXZlbnRzIGV4Y2VwdCB0aGUgcmVtb3ZlIGV2ZW50IGFmdGVyIHRoZSBpbnN0YW5jZSBoYXMgYmVlbiByZW1vdmVkXHJcbiAgICAgICAgICAgIGlmIChzZWxmLnJlbW92ZWQgJiYgbmFtZSAhPT0gJ3JlbW92ZScpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXdFdnQgPSBnZXRFdmVudERpc3BhdGNoZXIoc2VsZikuZmlyZShuYW1lLCBldnQsIGJ1YmJsZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBCdWJibGUgZXZlbnQgdXAgdG8gcGFyZW50c1xyXG4gICAgICAgICAgICBpZiAoYnViYmxlICE9PSBmYWxzZSAmJiBzZWxmLnBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHNlbGYucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocGFyZW50ICYmICFuZXdFdnQuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5maXJlKG5hbWUsIG5ld0V2dCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ld0V2dDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgb24obmFtZTogc3RyaW5nLCBjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnksIHByZXBlbmQ/OiBib29sZWFuKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldEV2ZW50RGlzcGF0Y2hlcih0aGlzKS5vbihuYW1lLCBjYWxsYmFjaywgcHJlcGVuZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb2ZmKG5hbWU6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldEV2ZW50RGlzcGF0Y2hlcih0aGlzKS5vZmYobmFtZSwgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG9uY2UobmFtZTogc3RyaW5nLCBjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0RXZlbnREaXNwYXRjaGVyKHRoaXMpLm9uY2UobmFtZSwgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGhhc0V2ZW50TGlzdGVuZXJzKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0RXZlbnREaXNwYXRjaGVyKHRoaXMpLmhhcyhuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbiJdfQ==