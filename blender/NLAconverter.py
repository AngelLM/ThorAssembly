import bpy

for ob in bpy.context.scene.objects:
    if ob.animation_data is not None:
        action = ob.animation_data.action
        if action is not None:
            track = ob.animation_data.nla_tracks.new()
            track.strips.new(action.name, action.frame_range[0], action)
            ob.animation_data.action = None