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
import { __extends } from "tslib";
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
export function observableDecorator(constructor) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YWJsZS5kZWNvcmF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcG9scHdhcmUvZmUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9kZWNvcmF0b3JzL29ic2VydmFibGUuZGVjb3JhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEVBQUU7QUFDRiw4Q0FBOEM7QUFDOUMsZ0RBQWdEO0FBQ2hELEVBQUU7QUFDRix3RUFBd0U7QUFDeEUsa0VBQWtFO0FBQ2xFLHNFQUFzRTtBQUN0RSxzRUFBc0U7QUFDdEUscUVBQXFFO0FBQ3JFLHdFQUF3RTtBQUN4RSw0QkFBNEI7QUFDNUIsRUFBRTtBQUNGLGlFQUFpRTtBQUNqRSxrRUFBa0U7QUFDbEUsRUFBRTtBQUNGLGtFQUFrRTtBQUNsRSxxRUFBcUU7QUFDckUsd0RBQXdEO0FBQ3hELHlFQUF5RTtBQUN6RSx5RUFBeUU7QUFDekUsd0VBQXdFO0FBQ3hFLGtFQUFrRTtBQUNsRSxFQUFFO0FBQ0YseUVBQXlFO0FBQ3pFLHVFQUF1RTtBQUN2RSxxRUFBcUU7QUFDckUsaUJBQWlCOztBQUVqQixPQUFPLEtBQUssWUFBWSxNQUFNLDJCQUEyQixDQUFDO0FBRTFELElBQU0sZUFBZSxHQUFHLFlBQVksQ0FBQyxlQUFlLENBQUM7QUFJckQsSUFBTSxrQkFBa0IsR0FBRyxVQUFTLEdBQUc7SUFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN2QixHQUFHLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLENBQUM7WUFDdkMsS0FBSyxFQUFFLEdBQUc7WUFDVixXQUFXLEVBQUUsVUFBUyxJQUFJLEVBQUUsS0FBSztnQkFDN0IsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRTtvQkFDekQsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDdEM7WUFDTCxDQUFDO1NBQ0osQ0FBQyxDQUFDO0tBQ047SUFFRCxPQUFPLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNoQyxDQUFDLENBQUM7QUFFRixNQUFNLFVBQVUsbUJBQW1CLENBQW9DLFdBQWM7SUFDakY7UUFBcUIsMkJBQVc7UUFBekI7O1FBd0NQLENBQUM7UUF0Q1Usc0JBQUksR0FBWCxVQUFlLElBQVksRUFBRSxHQUFrQixFQUFFLE1BQWdCO1lBQzdELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztZQUVsQixpRkFBaUY7WUFDakYsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQ25DLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7WUFFRCxJQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVoRSw2QkFBNkI7WUFDN0IsSUFBSSxNQUFNLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pDLElBQUksUUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDM0IsT0FBTyxRQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsRUFBRTtvQkFDN0MsUUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNqQyxRQUFNLEdBQUcsUUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUM1QjthQUNKO1lBRUQsT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUdNLG9CQUFFLEdBQVQsVUFBVSxJQUFZLEVBQUUsUUFBaUMsRUFBRSxPQUFpQjtZQUN4RSxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFFTSxxQkFBRyxHQUFWLFVBQVcsSUFBWSxFQUFFLFFBQWlDO1lBQ3RELE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBRU0sc0JBQUksR0FBWCxVQUFZLElBQVksRUFBRSxRQUFpQztZQUN2RCxPQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVNLG1DQUFpQixHQUF4QixVQUF5QixJQUFZO1lBQ2pDLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDTCxjQUFDO0lBQUQsQ0FBQyxBQXhDTSxDQUFjLFdBQVcsR0F3QzlCO0FBQ04sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vXHJcbi8vIEF1dGhvcjo6IFRvbSBUYW5nIDxwcmluY2lwbGV3YXJlQGdtYWlsLmNvbT5cclxuLy8gQ29weXJpZ2h0OjogQ29weXJpZ2h0IChjKSAyMDE3LCBYaWFvbG9uZyBUYW5nXHJcbi8vXHJcbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xyXG4vLyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcclxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXHJcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcclxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXHJcbi8vIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xyXG4vLyB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcbi8vXHJcbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXHJcbi8vIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG4vL1xyXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxyXG4vLyBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcclxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcclxuLy8gTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxyXG4vLyBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXHJcbi8vIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxyXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cclxuLy9cclxuLy8gRXhjZXB0IGFzIGNvbnRhaW5lZCBpbiB0aGlzIG5vdGljZSwgdGhlIG5hbWUocykgb2YgdGhlIGFib3ZlIGNvcHlyaWdodFxyXG4vLyBob2xkZXJzIHNoYWxsIG5vdCBiZSB1c2VkIGluIGFkdmVydGlzaW5nIG9yIG90aGVyd2lzZSB0byBwcm9tb3RlIHRoZVxyXG4vLyBzYWxlLCB1c2Ugb3Igb3RoZXIgZGVhbGluZ3MgaW4gdGhpcyBTb2Z0d2FyZSB3aXRob3V0IHByaW9yIHdyaXR0ZW5cclxuLy8gYXV0aG9yaXphdGlvbi5cclxuXHJcbmltcG9ydCAqIGFzIGRlcGVuZGVuY2llcyBmcm9tICdAcG9scHdhcmUvZmUtZGVwZW5kZW5jaWVzJztcclxuXHJcbmNvbnN0IEV2ZW50RGlzcGF0Y2hlciA9IGRlcGVuZGVuY2llcy5FdmVudERpc3BhdGNoZXI7XHJcblxyXG5pbXBvcnQgeyBJRXZlbnRBcmdzIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ldmVudC1hcmdzLmludGVyZmFjZSc7XHJcblxyXG5jb25zdCBnZXRFdmVudERpc3BhdGNoZXIgPSBmdW5jdGlvbihvYmopIHtcclxuICAgIGlmICghb2JqLl9ldmVudERpc3BhdGNoZXIpIHtcclxuICAgICAgICBvYmouX2V2ZW50RGlzcGF0Y2hlciA9IG5ldyBFdmVudERpc3BhdGNoZXIoe1xyXG4gICAgICAgICAgICBzY29wZTogb2JqLFxyXG4gICAgICAgICAgICB0b2dnbGVFdmVudDogZnVuY3Rpb24obmFtZSwgc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChFdmVudERpc3BhdGNoZXIuaXNOYXRpdmUobmFtZSkgJiYgb2JqLnRvZ2dsZU5hdGl2ZUV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnRvZ2dsZU5hdGl2ZUV2ZW50KG5hbWUsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvYmouX2V2ZW50RGlzcGF0Y2hlcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZhYmxlRGVjb3JhdG9yPFQgZXh0ZW5kcyB7IG5ldyguLi5hcmdzOiBhbnlbXSkgfT4oY29uc3RydWN0b3I6IFQpIHtcclxuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIGNvbnN0cnVjdG9yIHtcclxuXHJcbiAgICAgICAgcHVibGljIGZpcmU8VT4obmFtZTogc3RyaW5nLCBldnQ6IElFdmVudEFyZ3M8VT4sIGJ1YmJsZT86IGJvb2xlYW4pOiBJRXZlbnRBcmdzPFU+IHtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAvLyBQcmV2ZW50IGFsbCBldmVudHMgZXhjZXB0IHRoZSByZW1vdmUgZXZlbnQgYWZ0ZXIgdGhlIGluc3RhbmNlIGhhcyBiZWVuIHJlbW92ZWRcclxuICAgICAgICAgICAgaWYgKHNlbGYucmVtb3ZlZCAmJiBuYW1lICE9PSAncmVtb3ZlJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0V2dCA9IGdldEV2ZW50RGlzcGF0Y2hlcihzZWxmKS5maXJlKG5hbWUsIGV2dCwgYnViYmxlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEJ1YmJsZSBldmVudCB1cCB0byBwYXJlbnRzXHJcbiAgICAgICAgICAgIGlmIChidWJibGUgIT09IGZhbHNlICYmIHNlbGYucGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gc2VsZi5wYXJlbnQoKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwYXJlbnQgJiYgIW5ld0V2dC5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmZpcmUobmFtZSwgbmV3RXZ0LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3RXZ0O1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBvbihuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSwgcHJlcGVuZD86IGJvb2xlYW4pOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0RXZlbnREaXNwYXRjaGVyKHRoaXMpLm9uKG5hbWUsIGNhbGxiYWNrLCBwcmVwZW5kKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvZmYobmFtZTogc3RyaW5nLCBjYWxsYmFjazogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0RXZlbnREaXNwYXRjaGVyKHRoaXMpLm9mZihuYW1lLCBjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb25jZShuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRFdmVudERpc3BhdGNoZXIodGhpcykub25jZShuYW1lLCBjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaGFzRXZlbnRMaXN0ZW5lcnMobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRFdmVudERpc3BhdGNoZXIodGhpcykuaGFzKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuIl19